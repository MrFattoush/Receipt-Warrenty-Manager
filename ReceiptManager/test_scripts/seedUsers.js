const { API_URL } = require('../config');

const fetch = (...args) => import('node-fetch').then(mod => mod.default(...args));

const args = process.argv

const CREDENTIALS_TOO_SHORT = "cred-short"
const SAME_CREDENTIALS = "same-cred"

const USAGE_INFO = `node SeedUsers.js <Testing mode> <Clear users.json when done? (y/n)>\nModes: ${CREDENTIALS_TOO_SHORT}, ${SAME_CREDENTIALS}`

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

async function seedUsers(testingMode, cleanup, samples) {
  if (testingMode === CREDENTIALS_TOO_SHORT) {
    for (let i = 0; i < samples; i++) {
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
  else if (testingMode === SAME_CREDENTIALS) {
    for (let i = 0; i < samples; i++) {
      const username = `${getRandomString(1).repeat(8)}`;
      const email = `${getRandomString(1).repeat(8)}@test.com`;
      const password = `password`;

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

  if (cleanup === 'y') {
    const fs = require('fs');
    const path = require('path');
    const usersPath = path.join(__dirname, '../../backend/users.json');
    fs.writeFileSync(usersPath, '[]', 'utf-8');
    console.log('Cleaned up users.json');
  }
}

if (args.length != 5) {
  console.log(USAGE_INFO);
}
else {
  let testingMode = args[2];
  let cleanup = args[3];
  let samples = args[4];
  seedUsers(testingMode, cleanup, samples).catch(console.error);
}

