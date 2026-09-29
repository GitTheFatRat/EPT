import { listExams } from './src/services/exam.service.js';
async function run() {
  try {
    const res = await listExams(1, 100, false);
    const r1 = res.items.find(x => x.code === 'CAMBRIDGE-1-T1-R1');
    console.log(JSON.stringify(r1, null, 2));
  } catch (err) {
    console.error(err);
  }
}
run();
