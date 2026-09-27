const fs = require('fs');
let text = fs.readFileSync('md/03_API_CONTRACT.md', 'utf8');

text = text.replace(
  '- `username` (string)\n- `email`',
  '- `username` (string)\n- `fullName` (string, optional)\n- `email`'
);

// We should replace any user block that doesn't have fullName yet
text = text.replace(
  /"username": "user123",\n      "email":/g,
  '"username": "user123",\n      "fullName": "User Name",\n      "email":'
);

text = text.replace(
  /"username": "admin01",\n      "email":/g,
  '"username": "admin01",\n      "fullName": "Admin User",\n      "email":'
);

fs.writeFileSync('md/03_API_CONTRACT.md', text);
