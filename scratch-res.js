const fs = require('fs');
let code = fs.readFileSync('FE/src/features/result/ResultPage.jsx', 'utf8');

code = code.replace(
  /{item\.questionNumber \|\| \(idx \+ 1\)}/g,
  "{(!result?.exam?.code?.includes('FULL')) ? (idx + 1) : (item.questionNumber || (idx + 1))}"
);

fs.writeFileSync('FE/src/features/result/ResultPage.jsx', code);
