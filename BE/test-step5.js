const API_URL = 'http://localhost:3000/api';

async function runTests() {
  // Use the admin credentials to create another user just for this test
  // Actually, I can just login as the same user and use the same exam.
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

  // We need an Exam ID. Let's list exams and get the one we created.
  res = await fetch(`${API_URL}/exams`);
  data = await res.json();
  const examId = data.data.items[0].id;
  console.log('Using Exam ID:', examId);

  // Get the questions for this exam to get a valid questionId.
  // Wait, the exam endpoints don't return question IDs unless we fetch it by code.
  const examCode = data.data.items[0].code;
  res = await fetch(`${API_URL}/exams/${examCode}`);
  data = await res.json();
  const questions = data.data.passages[0].questions;
  const q1Id = questions[0].id;
  const q2Id = questions[1].id;

  console.log('\n--- 1. Practice Reading Attempt ---');
  res = await fetch(`${API_URL}/attempts/start`, {
    method: 'POST',
    headers: authHeader,
    body: JSON.stringify({ examId, mode: 'practice_reading' })
  });
  data = await res.json();
  console.log('Start Attempt Status:', res.status);
  const attemptId = data.data.attempt.id;

  console.log('\n--- 2. Autosave Answers ---');
  res = await fetch(`${API_URL}/attempts/${attemptId}/autosave`, {
    method: 'PATCH',
    headers: authHeader,
    body: JSON.stringify({ answers: { [q1Id]: 'A', [q2Id]: 'C' } }) // Q1 correct=A, Q2 correct=B. So 1 correct.
  });
  data = await res.json();
  console.log('Autosave Status:', res.status);

  console.log('\n--- 3. Submit Practice Reading ---');
  res = await fetch(`${API_URL}/attempts/${attemptId}/submit`, {
    method: 'POST',
    headers: authHeader,
    body: JSON.stringify({}) // Submitting without extra answers, will use autosaved
  });
  data = await res.json();
  console.log('Submit Status:', res.status);
  console.log('Band Score:', data.data.results[0].bandScore);
  console.log('Detail Answers:', JSON.stringify(data.data.results[0].detailAnswers, null, 2));

  console.log('\n--- 4. Full Test Attempt ---');
  res = await fetch(`${API_URL}/attempts/start`, {
    method: 'POST',
    headers: authHeader,
    body: JSON.stringify({ examId, mode: 'full_test' })
  });
  data = await res.json();
  const fullTestAttemptId = data.data.attempt.id;
  console.log('Start Full Test Status:', res.status);
  console.log('Current Segment:', data.data.attempt.currentSegment); // reading

  console.log('\n--- 5. Advance Segment ---');
  res = await fetch(`${API_URL}/attempts/${fullTestAttemptId}/advance-segment`, {
    method: 'POST',
    headers: authHeader
  });
  data = await res.json();
  console.log('Advance Segment Status:', res.status);
  console.log('New Current Segment:', data.data.attempt.currentSegment); // listening
  console.log('Listening Passages returned:', data.data.passages.length); // should be 0 because we didn't add listening passages, but we just verify it works
}

runTests().catch(console.error);
