const axios = require('axios');
(async () => {
  try {
    const loginRes = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'student@example.com',
      password: 'password123'
    });
    const token = loginRes.data.data.accessToken;
    const headers = { Authorization: 'Bearer ' + token };

    const examsRes = await axios.get('http://localhost:3001/api/exams?type=full_test', { headers });
    const fullTest = examsRes.data.data[0];

    const startRes = await axios.post('http://localhost:3001/api/attempts/start', {
      examId: fullTest.id,
      mode: 'full_test'
    }, { headers });
    const attempt = startRes.data.data;

    const answers = {};
    for (const passage of attempt.passages) {
      for (const q of passage.questions) {
        answers[q.id] = 'test answer';
      }
    }

    await axios.post('http://localhost:3001/api/attempts/' + attempt.id + '/submit', { answers }, { headers });

    const resultRes = await axios.get('http://localhost:3001/api/results/' + attempt.id, { headers });
    const result = resultRes.data.data;

    console.log('Total Questions:', result.totalQuestions);
    console.log('Points:', result.correctCount);
    console.log('Wrong:', result.wrongCount);
    console.log('Skipped:', result.skippedCount);
    console.log('Sum check (Points + Wrong + Skipped):', result.correctCount + result.wrongCount + result.skippedCount);

    const readingDetails = result.detailAnswers.filter(a => a.skill === 'reading');
    const listeningDetails = result.detailAnswers.filter(a => a.skill === 'listening');
    
    const readingMaxPoints = readingDetails.reduce((sum, d) => sum + (d.maxPoints || 1), 0);
    const listeningMaxPoints = listeningDetails.reduce((sum, d) => sum + (d.maxPoints || 1), 0);
    
    console.log('Reading maxPoints:', readingMaxPoints);
    console.log('Listening maxPoints:', listeningMaxPoints);
    console.log('Total maxPoints:', readingMaxPoints + listeningMaxPoints);

  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
})();
