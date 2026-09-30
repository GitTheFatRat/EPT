const axios = require('axios');
(async () => {
  try {
    const regRes = await axios.post('http://localhost:3001/api/auth/register', {
      username: 'testuser123',
      email: 'testuser123@example.com',
      password: 'password123',
      fullName: 'Test User'
    });
    console.log(regRes.data);
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
})();
