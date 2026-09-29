const fs = require('fs');
let text = fs.readFileSync('FE/src/features/exam/ExamListLayout.jsx', 'utf8');

text = text.replace(
  /let totalQuestions = 0;\n\s+relevantPassages\.forEach\(p => \{\n\s+totalQuestions \+= \(p\.questions\?\.length \|\| 0\);\n\s+\}\);/,
  'let totalQuestions = exam.totalQuestions || 0;'
);

fs.writeFileSync('FE/src/features/exam/ExamListLayout.jsx', text);
