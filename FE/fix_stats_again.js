import fs from 'fs';

const filePath = 'C:\\Users\\Administrator\\Desktop\\EPT\\FE\\src\\features\\dashboard\\DashboardPage.jsx';
let code = fs.readFileSync(filePath, 'utf8');

const oldBands = `    if (stats && stats.history) {
       const listeningHist = stats.history.filter(h => h.skill === 'listening');
       if (listeningHist.length > 0) listeningBand = listeningHist[listeningHist.length - 1].band;
       
       const readingHist = stats.history.filter(h => h.skill === 'reading');
       if (readingHist.length > 0) readingBand = readingHist[readingHist.length - 1].band;
  
       const fullTestHist = stats.history.filter(h => h.skill === 'overall');
       if (fullTestHist.length > 0) {
         overallBand = fullTestHist[fullTestHist.length - 1].band;
       } else if (stats.averageBand !== undefined) {
         overallBand = stats.averageBand;
       }
    }`;

const newBands = `    if (stats) {
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
    }`;

code = code.replace(oldBands, newBands);

const oldHistory = `    // Band History
    let historyData = [];
    if (stats && stats.history && stats.history.length > 0) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const groups = {};
      stats.history.forEach(h => {
         if (!h.createdAt) return;
         const d = new Date(h.createdAt);
         const monthStr = months[d.getMonth()];
         if (!groups[monthStr]) groups[monthStr] = [];
         groups[monthStr].push(h.band);
      });
      historyData = Object.keys(groups).map(k => ({
         month: k,
         band: groups[k][groups[k].length - 1]
      }));
    }`;

const newHistory = `    // Band History
    let historyData = [];
    if (stats && stats.overall?.history && stats.overall.history.length > 0) {
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
    }`;

code = code.replace(oldHistory, newHistory);

fs.writeFileSync(filePath, code);
console.log('Fixed Stats shape parsing in DashboardPage again');
