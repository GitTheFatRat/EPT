import fs from 'fs';

const filePath = 'C:\\Users\\Administrator\\Desktop\\EPT\\FE\\src\\features\\dashboard\\DashboardPage.jsx';
let code = fs.readFileSync(filePath, 'utf8');

// Replace band parsing
code = code.replace(/if\s*\(stats\s*&&\s*stats\.history\)\s*\{[\s\S]*?overallBand\s*=\s*stats\.averageBand;\s*\n\s*\}/, `if (stats) {
       const listeningHist = stats.listening?.history || [];
       if (listeningHist.length > 0) listeningBand = listeningHist[listeningHist.length - 1].bandScore;
       
       const readingHist = stats.reading?.history || [];
       if (readingHist.length > 0) readingBand = readingHist[readingHist.length - 1].bandScore;
  
       const fullTestHist = stats.overall?.history || [];
       if (fullTestHist.length > 0) {
         overallBand = fullTestHist[fullTestHist.length - 1].bandScore;
       } else if (stats.overall?.averageBand !== undefined) {
         overallBand = stats.overall.averageBand;
       }
    }`);

// Replace chart parsing
code = code.replace(/if\s*\(stats\s*&&\s*stats\.history\s*&&\s*stats\.history\.length\s*>\s*0\)\s*\{[\s\S]*?month:\s*k,[\s\S]*?band:\s*groups\[k\]\[groups\[k\]\.length\s*-\s*1\]\s*\n\s*\}\)\);\s*\n\s*\}/, `if (stats && stats.overall?.history && stats.overall.history.length > 0) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const groups = {};
      stats.overall.history.forEach(h => {
         if (!h.date) return;
         const d = new Date(h.date);
         const monthStr = months[d.getMonth()];
         if (!groups[monthStr]) groups[monthStr] = [];
         groups[monthStr].push(h.bandScore);
      });
      historyData = Object.keys(groups).map(k => ({
         month: k,
         band: groups[k][groups[k].length - 1]
      }));
    }`);

fs.writeFileSync(filePath, code);
console.log('Regex fixed stats');
