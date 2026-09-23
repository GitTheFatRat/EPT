const API_URL = 'http://localhost:3000/api';

async function runTests() {
  const email = `testuser_${Date.now()}@example.com`;
  const username = `testuser_${Date.now()}`;
  const password = 'Password123!';
  let accessToken = '';
  let refreshToken = '';

  console.log('--- TEST 1: Register ---');
  let res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password })
  });
  let data = await res.json();
  console.log('Status:', res.status);
  console.log('Response:', JSON.stringify(data, null, 2));
  if (data.success && data.data.user && !data.data.user.password_hash) {
    console.log('✅ Pass 1');
  } else {
    console.log('❌ Fail 1');
  }

  console.log('\n--- TEST 2: Register Duplicate ---');
  res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password })
  });
  data = await res.json();
  console.log('Status:', res.status);
  console.log('Response:', JSON.stringify(data, null, 2));
  if (!data.success && res.status === 409) {
    console.log('✅ Pass 2');
  } else {
    console.log('❌ Fail 2');
  }

  console.log('\n--- TEST 3: Login ---');
  res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  data = await res.json();
  console.log('Status:', res.status);
  console.log('Response:', JSON.stringify(data, null, 2));
  if (data.success && data.data.accessToken && data.data.refreshToken) {
    accessToken = data.data.accessToken;
    refreshToken = data.data.refreshToken;
    console.log('✅ Pass 3');
  } else {
    console.log('❌ Fail 3');
  }

  console.log('\n--- TEST 4: Get Me ---');
  res = await fetch(`${API_URL}/auth/me`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  data = await res.json();
  console.log('Status:', res.status);
  console.log('Response:', JSON.stringify(data, null, 2));
  if (data.success && data.data.email === email) {
    console.log('✅ Pass 4');
  } else {
    console.log('❌ Fail 4');
  }

  console.log('\n--- TEST 5: Get Me (Unauthorized) ---');
  res = await fetch(`${API_URL}/auth/me`);
  data = await res.json();
  console.log('Status:', res.status);
  console.log('Response:', JSON.stringify(data, null, 2));
  if (!data.success && res.status === 401) {
    console.log('✅ Pass 5');
  } else {
    console.log('❌ Fail 5');
  }

  console.log('\n--- TEST 6: Refresh ---');
  res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  data = await res.json();
  console.log('Status:', res.status);
  console.log('Response:', JSON.stringify(data, null, 2));
  if (data.success && data.data.accessToken) {
    console.log('✅ Pass 6');
  } else {
    console.log('❌ Fail 6');
  }

  console.log('\n--- TEST 7: Logout & Refresh ---');
  res = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  data = await res.json();
  console.log('Logout Status:', res.status);
  console.log('Logout Response:', JSON.stringify(data, null, 2));
  
  res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  data = await res.json();
  console.log('Refresh Status:', res.status);
  console.log('Refresh Response:', JSON.stringify(data, null, 2));
  if (!data.success && res.status === 401) {
    console.log('✅ Pass 7');
  } else {
    console.log('❌ Fail 7');
  }
}

runTests().catch(console.error);
