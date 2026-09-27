const fs = require('fs');
let text = fs.readFileSync('FE/src/features/dashboard/DashboardPage.jsx', 'utf8');

const calculateProgressFunc = `  const calculateProgress = (bandStr) => {
    if (bandStr === '--') return 0;
    const current = parseFloat(bandStr);
    const denominator = user?.targetBand ? parseFloat(user.targetBand) : 9.0;
    if (!denominator) return 0;
    const ratio = (current / denominator) * 100;
    return Math.min(Math.round(ratio), 100);
  };

  const progressOverall = calculateProgress(overallBand);
  const progressListening = calculateProgress(listeningBand);
  const progressReading = calculateProgress(readingBand);
  
  const displayTarget = user?.targetBand ? \`/ \${user.targetBand}\` : '/ 9.0';
`;

// Insert the new logic before `const testsCompleted = totalResults || 0;`
text = text.replace(
  '  // Tests completed & avg score',
  calculateProgressFunc + '\n  // Tests completed & avg score'
);

// Replace mock usages
text = text.replace(/mockDashboardData\.progressOverall/g, 'progressOverall');
text = text.replace(/mockDashboardData\.progressListening/g, 'progressListening');
text = text.replace(/mockDashboardData\.progressReading/g, 'progressReading');

// Replace / 9.0 in Listening and Reading
text = text.replace(/<span>\/ 9\.0<\/span>/g, '<span>{displayTarget}</span>');

fs.writeFileSync('FE/src/features/dashboard/DashboardPage.jsx', text);
