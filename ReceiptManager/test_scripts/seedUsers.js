const { API_URL } = require('../config');

const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));

// Utility: generate a random alphanumeric string of length 1–10
function getRandomString(maxLength) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = Math.floor(Math.random() * maxLength) + 1; // length 1–10
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function seedUsers() {
  for (let i = 0; i < 10; i++) {
    const username = `${getRandomString(12)}`;
    const email = `${username}@test.com`;
    const password = `${getRandomString(12)}`;

    const res = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        email,
        password,
        confirmPassword: password,
      }),
    });

    const data = await res.json();
    console.log(`Created ${username}:`, data);
  }
}

seedUsers().catch(console.error);