import fs from 'fs';

const filePath = 'C:\\Users\\Administrator\\Desktop\\EPT\\FE\\src\\features\\exam\\ExamListLayout.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// FIX 1: stats.history -> stats.reading.history
const oldCurrentBand = `  // Current band
  let currentBand = null;
  if (stats && stats.history) {
     if (skillCategory === 'reading') {
       const rh = stats.history.filter(h => h.skill === 'reading');
       if (rh.length > 0) currentBand = rh[rh.length - 1].band;
     } else if (skillCategory === 'listening') {
       const lh = stats.history.filter(h => h.skill === 'listening');
       if (lh.length > 0) currentBand = lh[lh.length - 1].band;
     }
  }`;

const newCurrentBand = `  // Current band
  let currentBand = null;
  if (stats) {
     if (skillCategory === 'reading') {
       const rh = stats.reading?.history || [];
       if (rh.length > 0) currentBand = rh[rh.length - 1].bandScore;
     } else if (skillCategory === 'listening') {
       const lh = stats.listening?.history || [];
       if (lh.length > 0) currentBand = lh[lh.length - 1].bandScore;
     }
  }`;

code = code.replace(oldCurrentBand, newCurrentBand);

// FIX 2: examResults filtering by skill
const oldExamResults = `    const relatedResults = results.filter(r => r.examId === exam.id && r.skill === (skillCategory === 'mock' ? 'overall' : skillCategory));
    // Wait, in \`exam_results\`, \`skill\` is 'reading', 'listening', or 'overall'. Mode is in \`exam_attempts\`.
    // We only have \`results\` from \`/api/results\`. Assuming it contains enough info.
    // Let's just use results filtered by examId.
    const examResults = results.filter(r => r.exam?.id === exam.id || r.examId === exam.id);`;

const newExamResults = `    const currentSkill = skillCategory === 'mock' ? 'overall' : skillCategory;
    const examResults = results.filter(r => (r.examId === exam.id || r.exam?.id === exam.id) && r.skill === currentSkill);`;

code = code.replace(oldExamResults, newExamResults);

fs.writeFileSync(filePath, code);
console.log('Fixed bugs in ExamListLayout.jsx');
