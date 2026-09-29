const fs = require('fs');
let text = fs.readFileSync('FE/src/features/exam/ExamListLayout.jsx', 'utf8');

text = text.replace(
  /skillCategory === 'mock' \? 120 :/g,
  "skillCategory === 'mock' ? 80 :"
);

fs.writeFileSync('FE/src/features/exam/ExamListLayout.jsx', text);
