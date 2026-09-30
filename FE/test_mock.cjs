const axios = require('axios');
(async () => {
  try {
    const loginRes = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'testuser123@example.com',
      password: 'password123'
    });
    const token = loginRes.data.data.accessToken;
    const headers = { Authorization: 'Bearer ' + token };

    const examId = '7a043c66-14b7-4325-901b-e150f9178b42'; // CAMBRIDGE-1-T3-FULL

    const startRes = await axios.post('http://localhost:3001/api/attempts/start', {
      examId: examId,
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

    console.log('--- TEST 3 FULL MOCK ---');
    console.log('Total Questions DB Field:', result.totalQuestions);
    console.log('Points:', result.correctCount);
    console.log('Wrong:', result.wrongCount);
    console.log('Skipped:', result.skippedCount);
    console.log('Sum check (Points + Wrong + Skipped):', result.correctCount + result.wrongCount + result.skippedCount);

    const readingDetails = result.detailAnswers.filter(a => a.skill === 'reading');
    const listeningDetails = result.detailAnswers.filter(a => a.skill === 'listening');
    
    const readingMaxPoints = readingDetails.reduce((sum, d) => sum + (d.maxPoints || 1), 0);
    const listeningMaxPoints = listeningDetails.reduce((sum, d) => sum + (d.maxPoints || 1), 0);
    
    console.log('Reading maxPoints sum:', readingMaxPoints);
    console.log('Listening maxPoints sum:', listeningMaxPoints);
    console.log('Total maxPoints sum:', readingMaxPoints + listeningMaxPoints);

  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
})();
