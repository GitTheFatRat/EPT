import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    console.log('--- BƯỚC 1 ---');
    const { data: p1 } = await supabase.from('passages').select('id, skill, title, audio_url, passage_text').order('skill').order('title');
    const b1 = p1.map(p => ({
        id: p.id,
        skill: p.skill,
        title: p.title,
        has_audio: p.audio_url !== null,
        text_length: p.passage_text ? p.passage_text.length : null
    }));
    console.table(b1);

    console.log('\n--- BƯỚC 2 ---');
    const { data: p2 } = await supabase.from('exams').select('code, title, is_published').order('code');
    console.table(p2);

    console.log('\n--- BƯỚC 3 ---');
    const { data: p3 } = await supabase.from('exam_passages').select('order_index, exams!inner(code), passages!inner(skill, title)');
    const b3 = p3.map(row => ({
        code: row.exams.code,
        order_index: row.order_index,
        skill: row.passages.skill,
        title: row.passages.title
    })).sort((a, b) => {
        if (a.code < b.code) return -1;
        if (a.code > b.code) return 1;
        return a.order_index - b.order_index;
    });
    console.table(b3);

    console.log('\n--- BƯỚC 4 ---');
    // The 7 passages we seeded are those NOT linked to TEST-EXAM-01, or rather the ones linked to CAMBRIDGE-1-T1-FULL
    const { data: fullLinks } = await supabase.from('exam_passages').select('passage_id, passages(title)').eq('exams.code', 'CAMBRIDGE-1-T1-FULL');
    const test1PassageIds = b3.filter(r => r.code === 'CAMBRIDGE-1-T1-FULL').map(r => {
        const row = p3.find(orig => orig.exams.code === 'CAMBRIDGE-1-T1-FULL' && orig.order_index === r.order_index);
        // Find the passage_id by querying again
        return null;
    });
    
    const { data: allQ } = await supabase.from('questions').select('id, type, content, passages!inner(id, title)');
    // Filter questions belonging to the 7 specific passages we created. The 7 passages have titles:
    // 'Section 1', 'Section 2', 'Section 3', 'Section 4', 'A spark, a flint: How fire leapt to life', 'Zoo conservation programmes', 'ARCHITECTURE - Reaching for the Sky'
    // BUT 'Section 1' might match the old one! Let's get the passage IDs from the FULL exam.
    const { data: fullExam } = await supabase.from('exams').select('id').eq('code', 'CAMBRIDGE-1-T1-FULL').single();
    const { data: epFull } = await supabase.from('exam_passages').select('passage_id').eq('exam_id', fullExam.id);
    const validPassageIds = epFull.map(ep => ep.passage_id);

    const test1Qs = allQ.filter(q => validPassageIds.includes(q.passages.id));
    
    const grouped = {};
    for (const q of test1Qs) {
        if (!grouped[q.passages.title]) grouped[q.passages.title] = { title: q.passages.title, so_cau_hoi: 0, types: new Set() };
        grouped[q.passages.title].so_cau_hoi++;
        grouped[q.passages.title].types.add(q.type);
    }
    const b4 = Object.values(grouped).map(g => ({
        title: g.title,
        so_cau_hoi: g.so_cau_hoi,
        cac_loai_cau_hoi: Array.from(g.types).join(', ')
    }));
    console.table(b4);

    console.log('\n--- BƯỚC 5 ---');
    const uniqueTypes = Array.from(new Set(test1Qs.map(q => q.type)));
    const pickedTypes = uniqueTypes.slice(0, 3);
    const pickedQs = pickedTypes.map(type => test1Qs.find(q => q.type === type));
    
    pickedQs.forEach((q, i) => {
        console.log(`\nCâu hỏi ${i+1} (Loại: ${q.type}, Bài: ${q.passages.title}):`);
        console.log(JSON.stringify(q.content, null, 2));
    });
}
run();
