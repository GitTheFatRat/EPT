const API_URL = 'http://localhost:3000/api';
import fs from 'fs';

async function runTests() {
  console.log('--- 1. Register Admin User ---');
  const email = `admin_${Date.now()}@test.com`;
  let res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username: `admin_${Date.now()}`, password: 'Password123' })
  });
  let data = await res.json();
  console.log('Register Response:', data);
  const adminId = data.data.user.id;

  // We will pause here to update the user to admin via MCP, then continue.
  // Actually, I can just write the adminId to a file so the main agent can read it and run MCP.
  fs.writeFileSync('admin_id.txt', adminId);
  console.log('Admin ID written to admin_id.txt. Run MCP to update role to admin, then run test-step4-part2.js');
}

runTests().catch(console.error);
