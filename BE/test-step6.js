const API_URL = 'http://localhost:3000/api';

async function runTests() {
  const email = 'admin_1790137730067@test.com';
  const password = 'Password123';
  
  let res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  let data = await res.json();
  const token = data.data.accessToken;
  const authHeader = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  // Get the exams
  res = await fetch(`${API_URL}/exams`);
  data = await res.json();
  const examId = data.data.items[0].id;
  const examCode = data.data.items[0].code;

  res = await fetch(`${API_URL}/exams/${examCode}`);
  data = await res.json();
  const readingQuestions = data.data.passages.find(p => p.skill === 'reading').questions;
  const q1Id = readingQuestions[0].id;

  console.log('\n--- 1. Start Full Test ---');
  res = await fetch(`${API_URL}/attempts/start`, {
    method: 'POST',
    headers: authHeader,
    body: JSON.stringify({ examId, mode: 'full_test' })
  });
  data = await res.json();
  const attemptId = data.data.attempt.id;
  
  console.log('\n--- 2. Autosave Reading & Advance ---');
  await fetch(`${API_URL}/attempts/${attemptId}/autosave`, {
    method: 'PATCH',
    headers: authHeader,
    body: JSON.stringify({ answers: { [q1Id]: 'A' } })
  });
  
  await fetch(`${API_URL}/attempts/${attemptId}/advance-segment`, {
    method: 'POST',
    headers: authHeader
  });

  console.log('\n--- 3. Submit Full Test ---');
  res = await fetch(`${API_URL}/attempts/${attemptId}/submit`, {
    method: 'POST',
    headers: authHeader,
    body: JSON.stringify({})
  });
  data = await res.json();
  console.log('Submit Status:', res.status);
  if (data.data && data.data.results) {
    console.log('Generated Results:', data.data.results.map(r => ({
      skill: r.skill, bandScore: r.bandScore
    })));
  }

  console.log('\n--- 4. GET /results ---');
  res = await fetch(`${API_URL}/results`, { headers: authHeader });
  data = await res.json();
  
  const resultsForAttempt = data.data.items.filter(r => r.attemptId === attemptId);
  console.log('Found Results for this attempt:', resultsForAttempt.length);
  const overallResult = resultsForAttempt.find(r => r.skill === 'overall');
  const readingResult = resultsForAttempt.find(r => r.skill === 'reading');
  const listeningResult = resultsForAttempt.find(r => r.skill === 'listening');
  
  console.log('Reading Band:', readingResult?.bandScore);
  console.log('Listening Band:', listeningResult?.bandScore);
  console.log('Overall Band:', overallResult?.bandScore);
  
  if (overallResult && readingResult && listeningResult) {
    const expectedOverall = Math.round((parseFloat(readingResult.bandScore) + parseFloat(listeningResult.bandScore)) / 2 * 2) / 2;
    console.log('Is Overall exactly average of both rounded to 0.5?', parseFloat(overallResult.bandScore) === expectedOverall);
  }

  console.log('\n--- 5. GET /results/:id (Overall) ---');
  res = await fetch(`${API_URL}/results/${overallResult.id}`, { headers: authHeader });
  data = await res.json();
  console.log('Overall Result Details Length (total questions):', data.data.detailAnswers.length);
  // It should contain questions from both reading and listening passages!
  // In our test exam, we might only have reading passages if listening passages aren't added,
  // but if both exist, it would include both.
  console.log('Total Questions in DB for this result:', data.data.totalQuestions);
}

runTests().catch(console.error);
