import { supabase } from '../db/supabaseClient.js';
import { AppError } from '../utils/AppError.js';
import { stripAnswersFromContent } from '../utils/stripAnswers.js';
import { getBandScore } from './bandConverter.js';
import { DURATIONS } from '../config/durations.js';
import { scoreQuestion } from './scoring.js';
/**
 * @param {object} dto
 * @param {string} userId
 * @returns {Promise<object>}
 */
export const startAttempt = async (dto, userId) => {
    let duration = 0;
    if (dto.mode === 'practice_reading') {
        duration = DURATIONS.practice_reading;
    }
    else if (dto.mode === 'practice_listening') {
        duration = DURATIONS.practice_listening;
    }
    else if (dto.mode === 'full_test') {
        duration = DURATIONS.full_test.reading;
    }
    const expiresAt = new Date(Date.now() + duration * 1000);
    const attemptData = {
        user_id: userId,
        exam_id: dto.examId,
        mode: dto.mode,
        status: 'in_progress',
        expires_at: expiresAt.toISOString(),
    };
    if (dto.mode === 'full_test') {
        attemptData.current_segment = 'reading';
        attemptData.reading_expires_at = expiresAt.toISOString();
    }
    const { data: attempt, error: attemptError } = await supabase
        .from('exam_attempts')
        .insert(attemptData)
        .select()
        .single();
    if (attemptError)
        throw new AppError(500, 'DB_ERROR', attemptError.message);
    let skillFilter = dto.mode === 'practice_listening' ? ['listening'] : ['reading'];
    const { data: examPassages, error: passagesError } = await supabase
        .from('exam_passages')
        .select('order_index, passages!inner(*)')
        .eq('exam_id', dto.examId)
        .in('passages.skill', skillFilter)
        .order('order_index', { ascending: true });
    
    if (passagesError) throw new AppError(500, 'DB_ERROR', passagesError.message);
    const passages = examPassages.map(ep => ({ ...ep.passages, exam_id: dto.examId, order_index: ep.order_index }));
    const passageIds = passages.map((p) => p.id);
    let questions = [];
    if (passageIds.length > 0) {
        const { data: qData, error: qError } = await supabase
            .from('questions')
            .select('*')
            .in('passage_id', passageIds)
            .order('order_index', { ascending: true });
        if (qError)
            throw new AppError(500, 'DB_ERROR', qError.message);
        questions = qData || [];
    }
    const mappedPassages = passages.map((p) => {
        const pQuestions = questions
            .filter((q) => q.passage_id === p.id)
            .map((q) => ({
            id: q.id,
            passageId: q.passage_id,
            orderIndex: q.order_index,
            questionNumber: q.question_number,
            type: q.type,
            groupInstruction: q.group_instruction,
            content: stripAnswersFromContent(q.content),
            points: q.points,
            createdAt: q.created_at,
            updatedAt: q.updated_at,
        }));
        return {
            id: p.id,
            examId: p.exam_id,
            skill: p.skill,
            title: p.title,
            passageText: p.passage_text,
            audioUrl: p.audio_url,
            orderIndex: p.order_index,
            createdAt: p.created_at,
            updatedAt: p.updated_at,
            questions: pQuestions
        };
    });
    return {
        attempt: {
            id: attempt.id,
            userId: attempt.user_id,
            examId: attempt.exam_id,
            mode: attempt.mode,
            status: attempt.status,
            expiresAt: attempt.expires_at,
            currentSegment: attempt.current_segment,
            readingExpiresAt: attempt.reading_expires_at,
            listeningExpiresAt: attempt.listening_expires_at,
            createdAt: attempt.created_at
        },
        passages: mappedPassages
    };
};
/**
 * @param {string} attemptId
 * @param {string} userId
 * @returns {Promise<object>}
 */
export const advanceSegment = async (attemptId, userId) => {
    const { data: attempt, error: fetchError } = await supabase
        .from('exam_attempts')
        .select('*')
        .eq('id', attemptId)
        .single();
    if (fetchError || !attempt) {
        throw new AppError(404, 'NOT_FOUND', 'Attempt not found');
    }
    if (attempt.user_id !== userId) {
        throw new AppError(403, 'FORBIDDEN', 'Attempt does not belong to user');
    }
    if (attempt.status !== 'in_progress' || attempt.mode !== 'full_test' || attempt.current_segment !== 'reading') {
        throw new AppError(400, 'INVALID_STATE', 'Cannot advance segment for this attempt');
    }
    const duration = DURATIONS.full_test.listening;
    const expiresAt = new Date(Date.now() + duration * 1000).toISOString();
    const { data: updatedAttempt, error: updateError } = await supabase
        .from('exam_attempts')
        .update({
        current_segment: 'listening',
        listening_expires_at: expiresAt,
        expires_at: expiresAt
    })
        .eq('id', attemptId)
        .select()
        .single();
    if (updateError)
        throw new AppError(500, 'DB_ERROR', updateError.message);
    const { data: examPassages, error: passagesError } = await supabase
        .from('exam_passages')
        .select('order_index, passages!inner(*)')
        .eq('exam_id', attempt.exam_id)
        .eq('passages.skill', 'listening')
        .order('order_index', { ascending: true });
    
    if (passagesError) throw new AppError(500, 'DB_ERROR', passagesError.message);
    const passages = examPassages.map(ep => ({ ...ep.passages, exam_id: attempt.exam_id, order_index: ep.order_index }));
    const passageIds = passages.map((p) => p.id);
    let questions = [];
    if (passageIds.length > 0) {
        const { data: qData, error: qError } = await supabase
            .from('questions')
            .select('*')
            .in('passage_id', passageIds)
            .order('order_index', { ascending: true });
        if (qError)
            throw new AppError(500, 'DB_ERROR', qError.message);
        questions = qData || [];
    }
    const mappedPassages = passages.map((p) => {
        const pQuestions = questions
            .filter((q) => q.passage_id === p.id)
            .map((q) => ({
            id: q.id,
            passageId: q.passage_id,
            orderIndex: q.order_index,
            questionNumber: q.question_number,
            type: q.type,
            groupInstruction: q.group_instruction,
            content: stripAnswersFromContent(q.content),
            points: q.points,
            createdAt: q.created_at,
            updatedAt: q.updated_at,
        }));
        return {
            id: p.id,
            examId: p.exam_id,
            skill: p.skill,
            title: p.title,
            passageText: p.passage_text,
            audioUrl: p.audio_url,
            orderIndex: p.order_index,
            createdAt: p.created_at,
            updatedAt: p.updated_at,
            questions: pQuestions
        };
    });
    return {
        attempt: {
            id: updatedAttempt.id,
            userId: updatedAttempt.user_id,
            examId: updatedAttempt.exam_id,
            mode: updatedAttempt.mode,
            status: updatedAttempt.status,
            expiresAt: updatedAttempt.expires_at,
            currentSegment: updatedAttempt.current_segment,
            readingExpiresAt: updatedAttempt.reading_expires_at,
            listeningExpiresAt: updatedAttempt.listening_expires_at,
            createdAt: updatedAttempt.created_at
        },
        passages: mappedPassages
    };
};
/**
 * @param {string} attemptId
 * @param {object} dto
 * @param {string} userId
 * @returns {Promise<void>}
 */
export const autosave = async (attemptId, dto, userId) => {
    if (!dto.answers || Object.keys(dto.answers).length === 0)
        return;
    const { data: attempt } = await supabase.from('exam_attempts').select('user_id').eq('id', attemptId).single();
    if (attempt?.user_id !== userId)
        throw new AppError(403, 'FORBIDDEN', 'Attempt does not belong to user');
    const draftAnswers = Object.keys(dto.answers).map(questionId => ({
        attempt_id: attemptId,
        question_id: questionId,
        user_answer: dto.answers[questionId]
    }));
    const { error } = await supabase
        .from('attempt_answers_draft')
        .upsert(draftAnswers, { onConflict: 'attempt_id, question_id' });
    if (error)
        throw new AppError(500, 'DB_ERROR', error.message);
};
/**
 * @param {string} attemptId
 * @param {object} dto
 * @param {string} userId
 * @returns {Promise<object>}
 */
export const submitAttempt = async (attemptId, dto, userId) => {
    const { data: attempt, error: fetchError } = await supabase.from('exam_attempts').select('*').eq('id', attemptId).single();
    if (fetchError || !attempt)
        throw new AppError(404, 'NOT_FOUND', 'Attempt not found');
    if (attempt.user_id !== userId)
        throw new AppError(403, 'FORBIDDEN', 'Attempt does not belong to user');
    if (attempt.status !== 'in_progress')
        throw new AppError(400, 'INVALID_STATE', 'Attempt is not in progress');
    const now = Date.now();
    const expiresAtMs = new Date(attempt.expires_at).getTime();
    const gracePeriodMs = (DURATIONS.grace_period || 0) * 1000;
    const isExpired = now > expiresAtMs + gracePeriodMs;
    // If already expired, do not save new answers from payload, just score whatever was last autosaved.
    if (!isExpired && dto.answers && Object.keys(dto.answers).length > 0) {
        const draftAnswers = Object.keys(dto.answers).map(questionId => ({
            attempt_id: attemptId,
            question_id: questionId,
            user_answer: dto.answers[questionId]
        }));
        await supabase.from('attempt_answers_draft').upsert(draftAnswers, { onConflict: 'attempt_id, question_id' });
    }
    const { data: savedAnswersList, error: draftError } = await supabase.from('attempt_answers_draft').select('*').eq('attempt_id', attemptId);
    if (draftError)
        throw new AppError(500, 'DB_ERROR', draftError.message);
    const savedAnswers = new Map();
    for (const ans of (savedAnswersList || []))
        savedAnswers.set(ans.question_id, ans.user_answer);
    let skillFilter = [];
    if (attempt.mode === 'practice_reading')
        skillFilter = ['reading'];
    else if (attempt.mode === 'practice_listening')
        skillFilter = ['listening'];
    else if (attempt.mode === 'full_test')
        skillFilter = ['reading', 'listening'];
    const { data: examPassages, error: passagesError } = await supabase.from('exam_passages').select('order_index, passages!inner(id, skill)').eq('exam_id', attempt.exam_id).in('passages.skill', skillFilter);
    if (passagesError) throw new AppError(500, 'DB_ERROR', passagesError.message);
    const passages = examPassages.map(ep => ({ ...ep.passages, exam_id: attempt.exam_id, order_index: ep.order_index }));
    const passageIds = passages.map((p) => p.id);
    const passageSkillMap = new Map();
    for (const p of passages)
        passageSkillMap.set(p.id, p.skill);
    let questions = [];
    if (passageIds.length > 0) {
        const { data: qData, error: qError } = await supabase.from('questions').select('*').in('passage_id', passageIds);
        if (qError)
            throw new AppError(500, 'DB_ERROR', qError.message);
        questions = qData || [];
    }
    let readingCorrect = 0, readingWrong = 0, readingSkipped = 0;
    let listeningCorrect = 0, listeningWrong = 0, listeningSkipped = 0;
    const readingDetails = [];
    const listeningDetails = [];
    const overallDetails = [];
    for (const q of questions) {
        const userAnswer = savedAnswers.get(q.id);
        const skill = passageSkillMap.get(q.passage_id);
        const score = scoreQuestion(q, userAnswer);
        
        let points = 0;
        let isSkipped = false;
        
        if (userAnswer === undefined || userAnswer === null || userAnswer === '') {
            isSkipped = true;
        } else if (typeof userAnswer === 'object') {
            const values = Object.values(userAnswer);
            if (values.length === 0 || values.every(v => !v || (typeof v === 'string' && !v.trim()))) {
                isSkipped = true;
            }
        }

        if (isSkipped) {
            if (skill === 'reading') readingSkipped++;
            else listeningSkipped++;
        }
        else {
            if (score.details && typeof score.details.correctItems === 'number')
                points = score.details.correctItems;
            else if (score.details && typeof score.details.correctBlanks === 'number')
                points = score.details.correctBlanks;
            else if (score.details && typeof score.details.correctLabels === 'number')
                points = score.details.correctLabels;
            else if (score.details && typeof score.details.correctCount === 'number')
                points = score.details.correctCount;
            else
                points = score.isCorrect ? (q.points || 1) : 0;
                
            if (points > 0) {
                if (skill === 'reading')
                    readingCorrect += points;
                else
                    listeningCorrect += points;
            }
            else {
                if (skill === 'reading')
                    readingWrong++;
                else
                    listeningWrong++;
            }
        }
        let maxPoints = 1;
        if (score.details) {
            maxPoints = score.details.totalItems || score.details.totalBlanks || score.details.totalLabels || score.details.totalCount || q.points || 1;
        } else {
            maxPoints = q.points || 1;
        }
        
        const detail = {
            questionId: q.id,
            questionNumber: q.question_number,
            skill: skill,
            userAnswer: isSkipped ? null : userAnswer,
            correctAnswer: q.content.correct_answer || q.content.correct_answers || q.content.items || q.content.blanks || q.content.labels,
            isCorrect: score.isCorrect,
            isPartiallyCorrect: score.isPartiallyCorrect,
            pointsAwarded: points,
            maxPoints: maxPoints,
            explanation: q.content.explanation || ''
        };
        if (skill === 'reading')
            readingDetails.push(detail);
        else
            listeningDetails.push(detail);
        overallDetails.push(detail);
    }
    
    // Recalculate totals directly from details to guarantee 100% consistency
    readingCorrect = readingDetails.reduce((sum, d) => sum + (d.pointsAwarded || 0), 0);
    readingSkipped = readingDetails.reduce((sum, d) => sum + (d.userAnswer === null ? d.maxPoints : 0), 0);
    readingWrong = readingDetails.reduce((sum, d) => sum + (d.maxPoints - (d.pointsAwarded || 0) - (d.userAnswer === null ? d.maxPoints : 0)), 0);
    
    listeningCorrect = listeningDetails.reduce((sum, d) => sum + (d.pointsAwarded || 0), 0);
    listeningSkipped = listeningDetails.reduce((sum, d) => sum + (d.userAnswer === null ? d.maxPoints : 0), 0);
    listeningWrong = listeningDetails.reduce((sum, d) => sum + (d.maxPoints - (d.pointsAwarded || 0) - (d.userAnswer === null ? d.maxPoints : 0)), 0);
    const resultsToInsert = [];
    if (attempt.mode === 'full_test') {
        const readingBand = getBandScore('reading', readingCorrect);
        const listeningBand = getBandScore('listening', listeningCorrect);
        const overallBand = Math.round((readingBand + listeningBand) / 2 * 2) / 2;
        
        const readingTotal = readingDetails.reduce((sum, d) => sum + (d.maxPoints || 1), 0);
        const listeningTotal = listeningDetails.reduce((sum, d) => sum + (d.maxPoints || 1), 0);
        const overallTotal = overallDetails.reduce((sum, d) => sum + (d.maxPoints || 1), 0);

        resultsToInsert.push({
            attempt_id: attemptId, user_id: userId, exam_id: attempt.exam_id, skill: 'reading',
            correct_count: readingCorrect, wrong_count: readingWrong, skipped_count: readingSkipped,
            total_questions: readingTotal, band_score: readingBand, detail_answers: readingDetails
        });
        resultsToInsert.push({
            attempt_id: attemptId, user_id: userId, exam_id: attempt.exam_id, skill: 'listening',
            correct_count: listeningCorrect, wrong_count: listeningWrong, skipped_count: listeningSkipped,
            total_questions: listeningTotal, band_score: listeningBand, detail_answers: listeningDetails
        });
        resultsToInsert.push({
            attempt_id: attemptId, user_id: userId, exam_id: attempt.exam_id, skill: 'overall',
            correct_count: readingCorrect + listeningCorrect, wrong_count: readingWrong + listeningWrong, skipped_count: readingSkipped + listeningSkipped,
            total_questions: overallTotal, band_score: overallBand, detail_answers: overallDetails
        });
    }
    else {
        const skill = attempt.mode === 'practice_reading' ? 'reading' : 'listening';
        const correct = skill === 'reading' ? readingCorrect : listeningCorrect;
        const wrong = skill === 'reading' ? readingWrong : listeningWrong;
        const skipped = skill === 'reading' ? readingSkipped : listeningSkipped;
        const details = skill === 'reading' ? readingDetails : listeningDetails;
        const band = getBandScore(skill, correct);
        
        const total = details.reduce((sum, d) => sum + (d.maxPoints || 1), 0);
        
        resultsToInsert.push({
            attempt_id: attemptId, user_id: userId, exam_id: attempt.exam_id, skill,
            correct_count: correct, wrong_count: wrong, skipped_count: skipped,
            total_questions: total, band_score: band, detail_answers: details
        });
    }
    const { data: inserted, error: insertResultsError } = await supabase.from('exam_results').insert(resultsToInsert).select();
    if (insertResultsError)
        throw new AppError(500, 'DB_ERROR', insertResultsError.message);
    const finalStatus = isExpired ? 'expired' : 'submitted';
    const { error: updateAttemptError } = await supabase.from('exam_attempts').update({ status: finalStatus, submitted_at: new Date().toISOString() }).eq('id', attemptId);
    if (updateAttemptError)
        throw new AppError(500, 'DB_ERROR', updateAttemptError.message);
    return {
        results: inserted.map(r => ({
            resultId: r.id,
            skill: r.skill,
            correctCount: r.correct_count,
            wrongCount: r.wrong_count,
            skippedCount: r.skipped_count,
            totalQuestions: r.total_questions,
            bandScore: r.band_score,
            detailAnswers: r.detail_answers
        }))
    };
};
/**
 * @param {string} attemptId
 * @param {string} userId
 * @returns {Promise<object>}
 */
export const getAttemptById = async (attemptId, userId) => {
    const { data: attempt, error: fetchError } = await supabase
        .from('exam_attempts')
        .select('*')
        .eq('id', attemptId)
        .single();
    if (fetchError || !attempt)
        throw new AppError(404, 'NOT_FOUND', 'Attempt not found');
    if (attempt.user_id !== userId)
        throw new AppError(403, 'FORBIDDEN', 'Attempt does not belong to user');
    let skillFilter = [];
    if (attempt.mode === 'practice_reading')
        skillFilter = ['reading'];
    else if (attempt.mode === 'practice_listening')
        skillFilter = ['listening'];
    else if (attempt.mode === 'full_test') {
        if (attempt.status === 'in_progress') {
            skillFilter = [attempt.current_segment];
        }
        else {
            skillFilter = ['reading', 'listening'];
        }
    }
    const { data: examPassages, error: passagesError } = await supabase
        .from('exam_passages')
        .select('order_index, passages!inner(*)')
        .eq('exam_id', attempt.exam_id)
        .in('passages.skill', skillFilter)
        .order('order_index', { ascending: true });

    if (passagesError) throw new AppError(500, 'DB_ERROR', passagesError.message);
    const passages = examPassages.map(ep => ({ ...ep.passages, exam_id: attempt.exam_id, order_index: ep.order_index }));
    const passageIds = passages.map((p) => p.id);
    let questions = [];
    if (passageIds.length > 0) {
        const { data: qData, error: qError } = await supabase
            .from('questions')
            .select('*')
            .in('passage_id', passageIds)
            .order('order_index', { ascending: true });
        if (qError)
            throw new AppError(500, 'DB_ERROR', qError.message);
        questions = qData || [];
    }
    const { data: draftAnswers, error: draftError } = await supabase
        .from('attempt_answers_draft')
        .select('*')
        .eq('attempt_id', attemptId);
    if (draftError)
        throw new AppError(500, 'DB_ERROR', draftError.message);
    const answersMap = new Map();
    for (const ans of (draftAnswers || [])) {
        answersMap.set(ans.question_id, ans.user_answer);
    }
    const mappedPassages = passages.map((p) => {
        const pQuestions = questions
            .filter((q) => q.passage_id === p.id)
            .map((q) => ({
            id: q.id,
            passageId: q.passage_id,
            orderIndex: q.order_index,
            questionNumber: q.question_number,
            type: q.type,
            groupInstruction: q.group_instruction,
            content: stripAnswersFromContent(q.content),
            points: q.points,
            createdAt: q.created_at,
            updatedAt: q.updated_at,
            savedAnswer: answersMap.get(q.id) || null
        }));
        return {
            id: p.id,
            examId: p.exam_id,
            skill: p.skill,
            title: p.title,
            passageText: p.passage_text,
            audioUrl: p.audio_url,
            orderIndex: p.order_index,
            createdAt: p.created_at,
            updatedAt: p.updated_at,
            questions: pQuestions
        };
    });
    return {
        attempt: {
            id: attempt.id,
            userId: attempt.user_id,
            examId: attempt.exam_id,
            mode: attempt.mode,
            status: attempt.status,
            expiresAt: attempt.expires_at,
            currentSegment: attempt.current_segment,
            readingExpiresAt: attempt.reading_expires_at,
            listeningExpiresAt: attempt.listening_expires_at,
            createdAt: attempt.created_at,
            submittedAt: attempt.submitted_at
        },
        passages: mappedPassages
    };
};

