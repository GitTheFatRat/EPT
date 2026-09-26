import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    // 1. Delete the monolithic exam
    await supabase.from('exams').delete().eq('code', 'CAMBRIDGE-01-TEST-01');

    // 2. Fetch the 7 passages
    const { data: passages } = await supabase.from('passages').select('id, title, skill');
    const pL1 = passages.find(p => p.title === 'Section 1' && p.skill === 'listening');
    const pL2 = passages.find(p => p.title === 'Section 2' && p.skill === 'listening');
    const pL3 = passages.find(p => p.title === 'Section 3' && p.skill === 'listening');
    const pL4 = passages.find(p => p.title === 'Section 4' && p.skill === 'listening');
    const pR1 = passages.find(p => p.title === 'A spark, a flint: How fire leapt to life' && p.skill === 'reading');
    const pR2 = passages.find(p => p.title === 'Zoo conservation programmes' && p.skill === 'reading');
    const pR3 = passages.find(p => p.title === 'ARCHITECTURE - Reaching for the Sky' && p.skill === 'reading');

    const examsToCreate = [
        { code: 'CAMBRIDGE-1-T1-R1', title: 'Cambridge IELTS 1 - Test 1 - Reading Passage 1', description: 'Practice Reading Passage 1', is_published: true, links: [{ p: pR1, o: 1 }] },
        { code: 'CAMBRIDGE-1-T1-R2', title: 'Cambridge IELTS 1 - Test 1 - Reading Passage 2', description: 'Practice Reading Passage 2', is_published: true, links: [{ p: pR2, o: 1 }] },
        { code: 'CAMBRIDGE-1-T1-R3', title: 'Cambridge IELTS 1 - Test 1 - Reading Passage 3', description: 'Practice Reading Passage 3', is_published: true, links: [{ p: pR3, o: 1 }] },
        { code: 'CAMBRIDGE-1-T1-L1', title: 'Cambridge IELTS 1 - Test 1 - Listening Section 1', description: 'Practice Listening Section 1', is_published: true, links: [{ p: pL1, o: 1 }] },
        { code: 'CAMBRIDGE-1-T1-L2', title: 'Cambridge IELTS 1 - Test 1 - Listening Section 2', description: 'Practice Listening Section 2', is_published: true, links: [{ p: pL2, o: 1 }] },
        { code: 'CAMBRIDGE-1-T1-L3', title: 'Cambridge IELTS 1 - Test 1 - Listening Section 3', description: 'Practice Listening Section 3', is_published: true, links: [{ p: pL3, o: 1 }] },
        { code: 'CAMBRIDGE-1-T1-L4', title: 'Cambridge IELTS 1 - Test 1 - Listening Section 4', description: 'Practice Listening Section 4', is_published: true, links: [{ p: pL4, o: 1 }] },
        { code: 'CAMBRIDGE-1-T1-FULL', title: 'Cambridge IELTS 1 - Test 1 - Full Mock Test', description: 'Full Mock Test covering Reading and Listening', is_published: true, links: [
            { p: pR1, o: 1 }, { p: pR2, o: 2 }, { p: pR3, o: 3 },
            { p: pL1, o: 1 }, { p: pL2, o: 2 }, { p: pL3, o: 3 }, { p: pL4, o: 4 }
        ] }
    ];

    for (const ex of examsToCreate) {
        // Insert exam
        const { data: insertedExam, error: exErr } = await supabase.from('exams').insert({
            code: ex.code,
            title: ex.title,
            description: ex.description,
            is_published: ex.is_published
        }).select().single();

        if (exErr) {
            console.error('Error creating exam', ex.code, exErr);
            continue;
        }

        // Insert links
        for (const link of ex.links) {
            const { error: linkErr } = await supabase.from('exam_passages').insert({
                exam_id: insertedExam.id,
                passage_id: link.p.id,
                order_index: link.o
            });
            if (linkErr) {
                console.error('Error linking passage for exam', ex.code, linkErr);
            }
        }
    }

    console.log('Restructure complete.');
}
run();
