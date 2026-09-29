import { listExams } from './src/services/exam.service.js';
async function run() {
  try {
    const res = await listExams(1, 100, false);
    console.log(JSON.stringify(res.items, null, 2));
  } catch (err) {
    console.error(err);
  }
}
run();

