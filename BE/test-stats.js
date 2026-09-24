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

  console.log('\n--- GET /results/stats ---');
  res = await fetch(`${API_URL}/results/stats`, { headers: authHeader });
  data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

runTests().catch(console.error);
