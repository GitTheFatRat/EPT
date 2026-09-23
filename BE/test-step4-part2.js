const API_URL = 'http://localhost:3000/api';

async function runTests() {
  console.log('--- 2. Login as Admin ---');
  // I need to use the email from the previous run, which I can just copy paste here or read from file, 
  // but it's easier to just do it all in one file with a fixed email or do it here since I know it.
  
  // Wait, I can just register a NEW user, then use MCP... wait I already ran MCP. I'll just use the known email: 'admin_1790137730067@test.com'
  const email = 'admin_1790137730067@test.com';
  const password = 'Password123';
  
  let res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  let data = await res.json();
  if (!data.success) {
    console.error('Login failed', data);
    return;
  }
  const token = data.data.accessToken;
  console.log('Login successful. Role:', data.data.user.role);

  console.log('\n--- 3. Create Exam ---');
  res = await fetch(`${API_URL}/exams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ title: 'Test Exam 1', code: 'TEST-EXAM-01', description: 'Test description' })
  });
  let text = await res.text();
  console.log('Create Exam Status:', res.status);
  console.log('Create Exam Raw Response:', text);
  try {
    data = JSON.parse(text);
  } catch (e) {
    return;
  }
  const examId = data.data.id;

  console.log('\n--- 4. Add Reading Passage ---');
  res = await fetch(`${API_URL}/exams/${examId}/passages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ skill: 'reading', orderIndex: 1, title: 'Reading Passage 1', passageText: 'This is a test passage.' })
  });
  data = await res.json();
  console.log('Add Passage Status:', res.status);
  console.log('Add Passage Response:', JSON.stringify(data, null, 2));
  const passageId = data.data.id;

  console.log('\n--- 5. Add Questions ---');
  const questionsPayload = {
    questions: [
      {
        orderIndex: 1,
        questionNumber: 1,
        type: 'multiple_choice',
        content: { question: 'Q1?', options: [{key: 'A', text: 'Op A'}], correct_answer: 'A', explanation: 'exp 1' },
        points: 1
      },
      {
        orderIndex: 2,
        questionNumber: 2,
        type: 'multiple_choice',
        content: { question: 'Q2?', options: [{key: 'B', text: 'Op B'}], correct_answer: 'B', explanation: 'exp 2' },
        points: 1
      }
    ]
  };
  res = await fetch(`${API_URL}/passages/${passageId}/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(questionsPayload)
  });
  data = await res.json();
  console.log('Add Questions Status:', res.status);
  console.log('Add Questions Response:', JSON.stringify(data, null, 2));

  console.log('\n--- 6. Get Exam By Code (Public/Unauthenticated) ---');
  res = await fetch(`${API_URL}/exams/TEST-EXAM-01`);
  data = await res.json();
  console.log('Get Exam Status:', res.status);
  
  const fetchedQuestions = data.data.passages[0].questions;
  console.log('Fetched Questions:', JSON.stringify(fetchedQuestions, null, 2));
  
  const hasAnswers = fetchedQuestions.some(q => q.content.correct_answer || q.content.explanation);
  if (hasAnswers) {
    console.log('❌ FAIL: Answers were NOT stripped!');
  } else {
    console.log('✅ PASS: Answers successfully stripped from public response.');
  }
}

runTests().catch(console.error);
