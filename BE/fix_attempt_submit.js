import fs from 'fs';

const p = 'C:\\Users\\Administrator\\Desktop\\EPT\\BE\\src\\services\\attempt.service.ts';
let code = fs.readFileSync(p, 'utf8');

// The rewrite script for submitAttempt
const startIndex = code.indexOf('export const submitAttempt = async');
const endIndex = code.indexOf('export const getAttemptById = async');
if (startIndex === -1 || endIndex === -1) throw new Error('Cannot find submitAttempt boundaries');

const newSubmit = `export const submitAttempt = async (attemptId: string, dto: SubmitAttemptDTO, userId: string) => {
  const { data: attempt, error: fetchError } = await supabase.from('exam_attempts').select('*').eq('id', attemptId).single();
  if (fetchError || !attempt) throw new AppError(404, 'NOT_FOUND', 'Attempt not found');
  if (attempt.user_id !== userId) throw new AppError(403, 'FORBIDDEN', 'Attempt does not belong to user');
  if (attempt.status !== 'in_progress') throw new AppError(400, 'INVALID_STATE', 'Attempt is not in progress');

  const now = Date.now();
  const expiresAtMs = new Date(attempt.expires_at).getTime();
  const gracePeriodMs = (DURATIONS.grace_period || 0) * 1000;
  
  if (now > expiresAtMs + gracePeriodMs) {
    await supabase.from('exam_attempts').update({ status: 'expired' }).eq('id', attemptId);
    throw new AppError(400, 'EXPIRED', 'Attempt has expired');
  }

  if (dto.answers && Object.keys(dto.answers).length > 0) {
    const draftAnswers = Object.keys(dto.answers).map(questionId => ({
      attempt_id: attemptId,
      question_id: questionId,
      user_answer: dto.answers![questionId]
    }));
    await supabase.from('attempt_answers_draft').upsert(draftAnswers, { onConflict: 'attempt_id, question_id' });
  }

  const { data: savedAnswersList, error: draftError } = await supabase.from('attempt_answers_draft').select('*').eq('attempt_id', attemptId);
  if (draftError) throw new AppError(500, 'DB_ERROR', draftError.message);

  const savedAnswers = new Map();
  for (const ans of (savedAnswersList || [])) savedAnswers.set(ans.question_id, ans.user_answer);

  let skillFilter: string[] = [];
  if (attempt.mode === 'practice_reading') skillFilter = ['reading'];
  else if (attempt.mode === 'practice_listening') skillFilter = ['listening'];
  else if (attempt.mode === 'full_test') skillFilter = ['reading', 'listening'];

  const { data: passages, error: passagesError } = await supabase.from('passages').select('id, skill').eq('exam_id', attempt.exam_id).in('skill', skillFilter);
  if (passagesError) throw new AppError(500, 'DB_ERROR', passagesError.message);

  const passageIds = passages.map((p: any) => p.id);
  const passageSkillMap = new Map();
  for (const p of passages) passageSkillMap.set(p.id, p.skill);

  let questions: any[] = [];
  if (passageIds.length > 0) {
    const { data: qData, error: qError } = await supabase.from('questions').select('*').in('passage_id', passageIds);
    if (qError) throw new AppError(500, 'DB_ERROR', qError.message);
    questions = qData || [];
  }

  let readingCorrect = 0, readingWrong = 0, readingSkipped = 0;
  let listeningCorrect = 0, listeningWrong = 0, listeningSkipped = 0;
  const readingDetails: any[] = [];
  const listeningDetails: any[] = [];
  const overallDetails: any[] = [];

  for (const q of questions) {
    const userAnswer = savedAnswers.get(q.id);
    const skill = passageSkillMap.get(q.passage_id);
    const score = scoreQuestion(q, userAnswer);
    let points = 0;

    if (userAnswer === undefined || userAnswer === null || userAnswer === '') {
      if (skill === 'reading') readingSkipped++;
      else listeningSkipped++;
    } else {
      if (score.isPartiallyCorrect && score.details && typeof score.details.correctItems === 'number') points = score.details.correctItems;
      else if (score.isPartiallyCorrect && score.details && typeof score.details.correctBlanks === 'number') points = score.details.correctBlanks;
      else if (score.isPartiallyCorrect && score.details && typeof score.details.correctLabels === 'number') points = score.details.correctLabels;
      else if (score.isPartiallyCorrect && score.details && typeof score.details.correctCount === 'number') points = score.details.correctCount;
      else points = score.isCorrect ? (q.points || 1) : 0;

      if (points > 0) {
        if (skill === 'reading') readingCorrect += points;
        else listeningCorrect += points;
      } else {
        if (skill === 'reading') readingWrong++;
        else listeningWrong++;
      }
    }

    const detail = {
      questionId: q.id,
      questionNumber: q.question_number,
      userAnswer: userAnswer,
      correctAnswer: q.content.correct_answer || q.content.correct_answers || q.content.items || q.content.blanks || q.content.labels,
      isCorrect: points > 0,
      explanation: q.content.explanation || ''
    };

    if (skill === 'reading') readingDetails.push(detail);
    else listeningDetails.push(detail);
    overallDetails.push(detail);
  }

  const resultsToInsert: any[] = [];

  if (attempt.mode === 'full_test') {
    const readingBand = getBandScore('reading', readingCorrect);
    const listeningBand = getBandScore('listening', listeningCorrect);
    const overallBand = Math.round((readingBand + listeningBand) / 2 * 2) / 2;

    resultsToInsert.push({
      attempt_id: attemptId, user_id: userId, exam_id: attempt.exam_id, skill: 'reading',
      correct_count: readingCorrect, wrong_count: readingWrong, skipped_count: readingSkipped,
      total_questions: readingDetails.length, band_score: readingBand, detail_answers: readingDetails
    });
    resultsToInsert.push({
      attempt_id: attemptId, user_id: userId, exam_id: attempt.exam_id, skill: 'listening',
      correct_count: listeningCorrect, wrong_count: listeningWrong, skipped_count: listeningSkipped,
      total_questions: listeningDetails.length, band_score: listeningBand, detail_answers: listeningDetails
    });
    resultsToInsert.push({
      attempt_id: attemptId, user_id: userId, exam_id: attempt.exam_id, skill: 'overall',
      correct_count: readingCorrect + listeningCorrect, wrong_count: readingWrong + listeningWrong, skipped_count: readingSkipped + listeningSkipped,
      total_questions: overallDetails.length, band_score: overallBand, detail_answers: overallDetails
    });
  } else {
    const skill = attempt.mode === 'practice_reading' ? 'reading' : 'listening';
    const correct = skill === 'reading' ? readingCorrect : listeningCorrect;
    const wrong = skill === 'reading' ? readingWrong : listeningWrong;
    const skipped = skill === 'reading' ? readingSkipped : listeningSkipped;
    const details = skill === 'reading' ? readingDetails : listeningDetails;
    const band = getBandScore(skill, correct);

    resultsToInsert.push({
      attempt_id: attemptId, user_id: userId, exam_id: attempt.exam_id, skill,
      correct_count: correct, wrong_count: wrong, skipped_count: skipped,
      total_questions: details.length, band_score: band, detail_answers: details
    });
  }

  const { data: inserted, error: insertResultsError } = await supabase.from('exam_results').insert(resultsToInsert).select();
  if (insertResultsError) throw new AppError(500, 'DB_ERROR', insertResultsError.message);

  const { error: updateAttemptError } = await supabase.from('exam_attempts').update({ status: 'submitted', submitted_at: new Date().toISOString() }).eq('id', attemptId);
  if (updateAttemptError) throw new AppError(500, 'DB_ERROR', updateAttemptError.message);

  return inserted.map(r => ({
    resultId: r.id,
    skill: r.skill,
    correctCount: r.correct_count,
    wrongCount: r.wrong_count,
    skippedCount: r.skipped_count,
    totalQuestions: r.total_questions,
    bandScore: r.band_score,
    detailAnswers: r.detail_answers
  }));
};
`;

code = code.substring(0, startIndex) + newSubmit + code.substring(endIndex);

fs.writeFileSync('fix_attempt2.js', fs.readFileSync('fix_attempt.js', 'utf8') + '\\n\\n// Now write submit\\nfs.writeFileSync(p, code);\\n');
// We run the first fix script then replace submitAttempt manually here.
