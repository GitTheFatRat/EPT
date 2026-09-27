const fs = require('fs');
let code = fs.readFileSync('FE/src/features/attempt/AttemptPage.jsx', 'utf8');

code = code.replace('passages,', 'passages: rawPassages,');

const remapping = `  const passages = React.useMemo(() => {
    if (mode === 'full_test') return rawPassages;
    let currentLocalNumber = 1;
    return rawPassages.map(p => ({
      ...p,
      questions: (p.questions || []).map(q => {
        const rewritten = { ...q, questionNumber: currentLocalNumber };
        const count = getSubQuestionCount(q);
        currentLocalNumber += count;
        return rewritten;
      })
    }));
  }, [rawPassages, mode]);

`;

code = code.replace(/const isLowTime = remainingTime < 300;/g, remapping + '  const isLowTime = remainingTime < 300;');

fs.writeFileSync('FE/src/features/attempt/AttemptPage.jsx', code);
