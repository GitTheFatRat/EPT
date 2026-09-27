const fs = require('fs');
let text = fs.readFileSync('md/03_API_CONTRACT.md', 'utf8');

text = text.replace(
  /"username": "string",\n  "email":/g,
  '"username": "string",\n  "fullName": "string",\n  "email":'
);

fs.writeFileSync('md/03_API_CONTRACT.md', text);
