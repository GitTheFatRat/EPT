import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({path: 'BE/.env'});
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    let query = supabase.from('exams').select('*, passages(id, skill, title)', { count: 'exact' });
    const { data, error, count } = await query;
    const passageIds = [...new Set(data.flatMap(d => d.passages.map(p => p.id)))];
    const { data: qData } = await supabase.from('questions').select('passage_id, content').in('passage_id', passageIds);
    
    const passageQCount = {};
    for (const q of (qData || [])) {
        const c = q.content || {};
        const pts = (c.blanks?.length || 0) + (c.items?.length || 0) + (c.labels?.length || 0);
        passageQCount[q.passage_id] = (passageQCount[q.passage_id] || 0) + (pts > 0 ? pts : 1);
    }

    const firstExam = data[0];
    let totalQuestions = 0;
    firstExam.passages.forEach(p => {
        totalQuestions += (passageQCount[p.id] || 0);
    });
    console.log(firstExam.code, totalQuestions);
}
run();
