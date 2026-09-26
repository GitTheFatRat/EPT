import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const PASSAGE_1 = `<h2>GLASS CAPTURING THE DANCE OF LIGHT</h2>
<p>A Glass, in one form or another, has long been in noble service to humans As one of the most widely used of manufactured materials, and certainly the most versatile, it can be as imposing as a telescope mirror the width of a tennis court or as small and simple as a marble rolling across dirt The uses of this adaptable material have been broadened dramatically by new technologies glass fibre optics — more than eight million miles — carrying telephone and television signals across nations, glass ceramics serving as the nose cones of missiles and as crowns for teeth; tiny glass beads taking radiation doses inside the body to specific organs, even a new type of glass fashioned of nuclear waste in order to dispose of that unwanted material.</p>
<p>B On the horizon are optical computers These could store programs and process information by means of light - pulses from tiny lasers - rather than electrons And the pulses would travel over glass fibres, not copper wire These machines could function hundreds of times faster than today's electronic computers and hold vastly more information Today fibre optics are used to obtain a clearer image of smaller and smaller objects than ever before - even bacterial viruses. A new generation of optical instruments is emerging that can provide detailed imaging of the inner workings of cells. It is the surge in fibre optic use and in liquid crystal displays that has set the U.S. glass industry (a 16 billion dollar business employing some 150,000 workers) to building new plants to meet demand.</p>
<p>C But it is not only in technology and commerce that glass has widened its horizons. The use of glass as art, a tradition spins back at least to Roman times, is also booming. Nearly everywhere, it seems, men and women are blowing glass and creating works of art. "I didn't sell a piece of glass until 1975," Dale Chihuly said, smiling, for in the 18 years since the end of the dry spell, he has become one of the most financially successful artists of the 20th century. He now has a new commission - a glass sculpture for the headquarters building of a pizza company - for which his fee is half a million dollars.</p>
<p>D But not all the glass technology that touches our lives is ultra-modern. Consider the simple light bulb; at the turn of the century most light bulbs were hand blown, and the cost of one was equivalent to half a day's pay for the average worker. In effect, the invention of the ribbon machine by Corning in the 1920s lighted a nation. The price of a bulb plunged. Small wonder that the machine has been called one of the great mechanical achievements of all time. Yet it is very simple: a narrow ribbon of molten glass travels over a moving belt of steel in which there are holes. The glass sags through the holes and into waiting moulds. Puffs of compressed air then shape the glass. In this way, the envelope of a light bulb is made by a single machine at the rate of 66,000 an hour, as compared with 1,200 a day produced by a team of four glassblowers.</p>
<p>E The secret of the versatility of glass lies in its interior structure. Although it is rigid, and thus like a solid, the atoms are arranged in a random disordered fashion, characteristic of a liquid. In the melting process, the atoms in the raw materials are disturbed from their normal position in the molecular structure; before they can find their way back to crystalline arrangements the glass cools. This looseness in molecular structure gives the material what engineers call tremendous "formability" which allows technicians to tailor glass to whatever they need.</p>
<p>F Today, scientists continue to experiment with new glass mixtures and building designers test their imaginations with applications of special types of glass. A London architect, Mike Davies, sees even more dramatic buildings using molecular chemistry. "Glass is the great building material of the future, the 'dynamic skin'," he said. "Think of glass that has been treated to react to electric currents going through it, glass that will change from clear to opaque at the push of a button, that gives you instant curtains. Think of how the tall buildings in New York could perform a symphony of colours as the glass in them is made to change colours instantly." Glass as instant curtains is available now, but the cost is exorbitant. As for the glass changing colours instantly, that may come true. Mike Davies's vision may indeed be on the way to fulfilment.</p>`;

const PASSAGE_2 = `<h2>Why some women cross the finish line ahead of men</h2>
<p>RECRUITMENT: The course is tougher but women are staying the distance, reports Andrew Crisp.</p>
<p>A Women who apply for jobs in middle or senior management have a higher success rate than men, according to an employment survey. But of course far fewer of them apply for these positions. The study, by recruitment consultants NB Selection, shows that while one in six men who appear on interview shortlists get jobs, the figure rises to one in four for women.</p>
<p>B The study concentrated on applications for management positions in the $45,000 to $110,000 salary range and found that women are more successful than men in both the private and public sectors Dr Elisabeth Marx from London-based NB Selection described the findings as encouraging for women, in that they send a positive message to them to apply for interesting management positions. But she added, "We should not lose sight of the fact that significantly fewer women apply for senior positions in comparison with men."</p>
<p>C Reasons for higher success rates among women are difficult to isolate. One explanation suggested is that if a woman candidate manages to get on a shortlist, then she has probably already proved herself to be an exceptional candidate. Dr Marx said that when women apply for positions they tend to be better qualified than their male counterparts but are more selective and conservative in their job search. Women tend to research thoroughly before applying for positions or attending interviews. Men, on the other hand, seem to rely on their ability to sell themselves and to convince employers that any shortcomings they have will not prevent them from doing a good job.</p>
<p>D Managerial and executive progress made by women is confirmed by the annual survey of boards of directors carried out by Korn/Ferry/Carre/ Orban International. This year the survey shows a doubling of the number of women serving as non-executive directors compared with the previous year. However, progress remains painfully slow and there were still only 18 posts filled by women out of a total of 354 non-executive positions surveyed. Hilary Sears, a partner with Korn/Ferry, said, "Women have raised the level of grades we are employed in but we have still not broken through barriers to the top."</p>
<p>E In Europe a recent feature of corporate life in the recession has been the de-layering of management structures. Sears said that this has halted progress for women in as much as de-layering has taken place either where women are working or in layers they aspire to. Sears also noted a positive trend from the recession, which has been the growing number of women who have started up on their own.</p>
<p>F In business as a whole, there are a number of factors encouraging the prospect of greater equality in the workforce. Demographic trends suggest that the number of women going into employment is steadily increasing. In addition a far greater number of women are now passing through higher education, making them better qualified to move into management positions.</p>
<p>G Organisations such as the European Women's Management Development Network provide a range of opportunities for women to enhance their skills and contacts. Through a series of both pan-European and national workshops and conferences the barriers to women in employment are being broken down. However, Ariane Berthoin Antal, director of the International Institute for Organisational Change of Archamps in France, said that there is only anecdotal evidence of changes in recruitment patterns. And she said, "It's still so hard for women to even get on to shortlists -there are so many hurdles and barriers." Antal agreed that there have been some positive signs but said "Until there is a belief among employers, until they value the difference, nothing will change."</p>`;

const PASSAGE_3 = `<h2>Population viability analysis</h2>
<h3>Part A</h3>
<p>To make political decisions about the extent and type of forestry in a region it is important to understand the consequences of those decisions. One tool for assessing the impact of forestry on the ecosystem is population viability analysis (PVA). This is a tool for predicting the probability that a species will become extinct in a particular region over a specific period. It has been successfully used in the United States to provide input into resource exploitation decisions and assist wildlife managers and there is now enormous potential for using population viability to assist wildlife management in Australia's forests.</p>
<p>A species becomes extinct when the last individual dies. This observation is a useful starting point for any discussion of extinction as it highlights the role of luck and chance in the extinction process. To make a prediction about extinction we need to understand the processes that can contribute to it and these fall into four broad categories which are discussed below.</p>
<h3>Part B</h3>
<p>A Early attempts to predict population viability were based on demographic uncertainty Whether an individual survives from one year to the next will largely be a matter of chance. Some pairs may produce several young in a single year while others may produce none in that same year. Small populations will fluctuate enormously because of the random nature of birth and death and these chance fluctuations can cause species extinctions even if, on average, the population size should increase. Taking only this uncertainty of ability to reproduce into account, extinction is unlikely if the number of individuals in a population is above about 50 and the population is growing.</p>
<p>B Small populations cannot avoid a certain amount of inbreeding. This is particularly true if there is a very small number of one sex. For example, if there are only 20 individuals of a species and only one is a male, all future individuals in the species must be descended from that one male. For most animal species such individuals are less likely to survive and reproduce. Inbreeding increases the chance of extinction.</p>
<p>C Variation within a species is the raw material upon which natural selection acts. Without genetic variability a species lacks the capacity to evolve and cannot adapt to changes in its environment or to new predators and new diseases. The loss of genetic diversity associated with reductions in population size will contribute to the likelihood of extinction.</p>
<p>D Recent research has shown that other factors need to be considered. Australia's environment fluctuates enormously from year to year. These fluctuations add yet another degree of uncertainty to the survival of many species. Catastrophes such as fire, flood, drought or epidemic may reduce population sizes to a small fraction of their average level. When allowance is made for these two additional elements of uncertainty the population size necessary to be confident of persistence for a few hundred years may increase to several thousand.</p>
<h3>Part C</h3>
<p>Beside these processes we need to bear in mind the distribution of a population. A species that occurs in five isolated places each containing 20 individuals will not have the same probability of extinction as a species with a single population of 100 individuals in a single locality.</p>
<p>Where logging occurs (that is, the cutting down of forests for timber) forest-dependent creatures in that area will be forced to leave. Ground-dwelling herbivores may return within a decade. However, arboreal marsupials (that is animals which live in trees) may not recover to pre-logging densities for over a century. As more forests are logged, animal population sizes will be reduced further. Regardless of the theory or model that we choose, a reduction in population size decreases the genetic diversity of a population and increases the probability of extinction because of any or all of the processes listed above. It is therefore a scientific fact that increasing the area that is loaded in any region will increase the probability that forest-dependent animals will become extinct.</p>`;

async function run() {
    console.log('Seeding Test 4...');
    const exams = [
        { code: 'CAMBRIDGE-1-T4-R1', title: 'Cambridge IELTS 1 - Test 4 - Reading Passage 1' },
        { code: 'CAMBRIDGE-1-T4-R2', title: 'Cambridge IELTS 1 - Test 4 - Reading Passage 2' },
        { code: 'CAMBRIDGE-1-T4-R3', title: 'Cambridge IELTS 1 - Test 4 - Reading Passage 3' },
        { code: 'CAMBRIDGE-1-T4-L1', title: 'Cambridge IELTS 1 - Test 4 - Listening Section 1' },
        { code: 'CAMBRIDGE-1-T4-L2', title: 'Cambridge IELTS 1 - Test 4 - Listening Section 2' },
        { code: 'CAMBRIDGE-1-T4-L3', title: 'Cambridge IELTS 1 - Test 4 - Listening Section 3' },
        { code: 'CAMBRIDGE-1-T4-L4', title: 'Cambridge IELTS 1 - Test 4 - Listening Section 4' },
        { code: 'CAMBRIDGE-1-T4-FULL', title: 'Cambridge IELTS 1 - Test 4 - Full Mock Test' }
    ];

    const insertedExams = {};
    for (const ex of exams) {
        const { data } = await supabase.from('exams').insert({
            code: ex.code, title: ex.title, is_published: true
        }).select().single();
        insertedExams[ex.code] = data.id;
    }

    const passagesData = [
        { skill: 'reading', title: 'GLASS CAPTURING THE DANCE OF LIGHT', passage_text: PASSAGE_1 },
        { skill: 'reading', title: 'Why some women cross the finish line ahead of men', passage_text: PASSAGE_2 },
        { skill: 'reading', title: 'Population viability analysis', passage_text: PASSAGE_3 },
        { skill: 'listening', title: 'Listening Section 1', audio_url: 'https://kigoxvdlcyjxfpetuxiu.supabase.co/storage/v1/object/public/listening-audio/cambridge-1/Test%204%20-%20Section%201.mp3' },
        { skill: 'listening', title: 'Listening Section 2', audio_url: 'https://kigoxvdlcyjxfpetuxiu.supabase.co/storage/v1/object/public/listening-audio/cambridge-1/Test%204%20-%20Section%202.mp3' },
        { skill: 'listening', title: 'Listening Section 3', audio_url: 'https://kigoxvdlcyjxfpetuxiu.supabase.co/storage/v1/object/public/listening-audio/cambridge-1/Test%204%20-%20Section%203.mp3' },
        { skill: 'listening', title: 'Listening Section 4', audio_url: 'https://kigoxvdlcyjxfpetuxiu.supabase.co/storage/v1/object/public/listening-audio/cambridge-1/Test%204%20-%20Section%204.mp3' }
    ];

    const insertedPassages = [];
    for (const p of passagesData) {
        const { data } = await supabase.from('passages').insert(p).select().single();
        insertedPassages.push(data);
    }

    const links = [
        { exam: 'CAMBRIDGE-1-T4-R1', passage: 0, order: 1 },
        { exam: 'CAMBRIDGE-1-T4-R2', passage: 1, order: 1 },
        { exam: 'CAMBRIDGE-1-T4-R3', passage: 2, order: 1 },
        { exam: 'CAMBRIDGE-1-T4-L1', passage: 3, order: 1 },
        { exam: 'CAMBRIDGE-1-T4-L2', passage: 4, order: 1 },
        { exam: 'CAMBRIDGE-1-T4-L3', passage: 5, order: 1 },
        { exam: 'CAMBRIDGE-1-T4-L4', passage: 6, order: 1 },
        { exam: 'CAMBRIDGE-1-T4-FULL', passage: 0, order: 1 },
        { exam: 'CAMBRIDGE-1-T4-FULL', passage: 1, order: 2 },
        { exam: 'CAMBRIDGE-1-T4-FULL', passage: 2, order: 3 },
        { exam: 'CAMBRIDGE-1-T4-FULL', passage: 3, order: 4 },
        { exam: 'CAMBRIDGE-1-T4-FULL', passage: 4, order: 5 },
        { exam: 'CAMBRIDGE-1-T4-FULL', passage: 5, order: 6 },
        { exam: 'CAMBRIDGE-1-T4-FULL', passage: 6, order: 7 }
    ];
    for (const link of links) {
        await supabase.from('exam_passages').insert({
            exam_id: insertedExams[link.exam],
            passage_id: insertedPassages[link.passage].id,
            order_index: link.order
        });
    }

    const qs = [];
    
    // R1: 13 qs
    qs.push({
        passage_id: insertedPassages[0].id, order_index: 1, question_number: 1, type: 'matching_headings',
        group_instruction: 'Questions 1-5: Choose the most suitable heading for each paragraph.',
        content: {
            headings: [{key:'i',text:'Growth in the market for glass crafts'},{key:'ii',text:'Computers and their dependence on glass'},{key:'iii',text:'What makes glass so adaptable'},{key:'iv',text:'Historical development of glass'},{key:'v',text:'Scientists\' dreams cost millions'},{key:'vi',text:'Architectural experiments with glass'},{key:'vii',text:'Glass art galleries flourish'},{key:'viii',text:'Exciting innovations in fibre optics'},{key:'ix',text:'A former glass technology'},{key:'x',text:'Everyday uses of glass'}],
            items: [{paragraph:'B',correct_answer:'viii'},{paragraph:'C',correct_answer:'i'},{paragraph:'D',correct_answer:'ix'},{paragraph:'E',correct_answer:'iii'},{paragraph:'F',correct_answer:'vi'}]
        }, points: 5
    });
    qs.push({
        passage_id: insertedPassages[0].id, order_index: 2, question_number: 6, type: 'diagram_label_completion',
        group_instruction: 'Questions 6-8: Label the diagram below.',
        content: {
            image_url: 'https://kigoxvdlcyjxfpetuxiu.supabase.co/storage/v1/object/public/listening-audio/cambridge-1/test4_r1_diagram.jpg',
            labels: [{label_id: "6", correct_answers: ["molten glass", "ribbon of glass", "molten glass ribbon"]}, {label_id: "7", correct_answers: ["belt of steel", "steel belt", "moving belt"]}, {label_id: "8", correct_answers: ["moulds", "lightbulb moulds"]}]
        }, points: 3
    });
    qs.push({
        passage_id: insertedPassages[0].id, order_index: 3, question_number: 9, type: 'matching_features',
        group_instruction: 'Questions 9-13: State whether these uses exist today (A), will exist in the future (B) or are not mentioned (C).',
        content: {
            prompt: 'Look at the list below of the uses of glass.',
            options: [{key:'A',text:'if the uses exist today'},{key:'B',text:'if the uses will exist in the future'},{key:'C',text:'if the uses are not mentioned by the writer'}],
            items: [{statement:'9. dental fittings',correct_answer:'A'},{statement:'10. optical computers',correct_answer:'B'},{statement:'11. sculptures',correct_answer:'A'},{statement:'12. fashions',correct_answer:'C'},{statement:'13. curtains',correct_answer:'A'}]
        }, points: 5
    });

    // R2: 14 qs
    qs.push({
        passage_id: insertedPassages[1].id, order_index: 1, question_number: 14, type: 'matching_information',
        group_instruction: 'Questions 14-19: State which paragraph discusses each of the points below.',
        content: {
            prompt: 'State which paragraph discusses each of the points below.',
            options: [{key:'A',text:'A'},{key:'B',text:'B'},{key:'C',text:'C'},{key:'D',text:'D'},{key:'E',text:'E'},{key:'F',text:'F'},{key:'G',text:'G'}],
            items: [{statement:'14. The drawbacks of current company restructuring patterns.',correct_answer:'E'},{statement:'15. Associations that provide support for professional women.',correct_answer:'G'},{statement:'16. The success rate of female job applicants for management positions.',correct_answer:'A'},{statement:'17. Male and female approaches to job applications.',correct_answer:'C'},{statement:'18. Reasons why more women are being employed in the business sector.',correct_answer:'F'},{statement:'19. The improvement in female numbers on company management structures.',correct_answer:'D'}]
        }, points: 6
    });
    qs.push({
        passage_id: insertedPassages[1].id, order_index: 2, question_number: 20, type: 'matching_features',
        group_instruction: 'Questions 20-23: Which of the list of points below do these consultants make?',
        content: {
            prompt: 'Which of the list of points below do these consultants make?',
            options: [{key:'M',text:'if the point is made by Dr Marx'},{key:'S',text:'if the point is made by Hilary Sears'},{key:'A',text:'if the point is made by Ariane Berthoin Antal'}],
            items: [{statement:'20. Selection procedures do not favour women.',correct_answer:'A'},{statement:'21. The number of female-run businesses is increasing.',correct_answer:'S'},{statement:'22. Male applicants exceed female applicants for top posts.',correct_answer:'M'},{statement:'23. Women hold higher positions now than they used to.',correct_answer:'S'}]
        }, points: 4
    });
    const sa24 = [{q:24,s:'What change has there been in the number of women in top management positions detailed in the annual survey?',a:['it has doubled', 'double', 'doubled', 'doubling']},{q:25,s:'What aspect of company structuring has disadvantaged women?',a:['de-layering']},{q:26,s:'What information tells us that more women are working nowadays?',a:['demographic trends']},{q:27,s:'Which group of people should change their attitude to recruitment?',a:['employers']}];
    sa24.forEach((q, i) => qs.push({ passage_id: insertedPassages[1].id, order_index: 3 + i, question_number: q.q, type: 'short_answer', group_instruction: 'Questions 24-27: Answer the following questions.', content: { question: q.s, word_limit: 'NO MORE THAN THREE WORDS', correct_answers: q.a }, points: 1 }));

    // R3: 12 qs
    const yn28 = [{q:28,s:'Scientists are interested in the effect of forestry on native animals.',a:'YES'},{q:29,s:'PVA has been used in Australia for many years.',a:'NO'},{q:30,s:'A species is said to be extinct when only one individual exists.',a:'NO'},{q:31,s:'Extinction is a naturally occurring phenomenon.',a:'NOT GIVEN'}];
    yn28.forEach((q, i) => qs.push({ passage_id: insertedPassages[2].id, order_index: i+1, question_number: q.q, type: 'yes_no_not_given', group_instruction: 'Questions 28-31: YES, NO, NOT GIVEN', content: { statement: q.s, correct_answer: q.a, explanation: '' }, points: 1 }));
    
    qs.push({
        passage_id: insertedPassages[2].id, order_index: 5, question_number: 32, type: 'matching_information',
        group_instruction: 'Questions 32-35: Match the list of processes to the paragraphs.',
        content: {
            prompt: 'Match the list of processes (i-vi) to the paragraphs.',
            options: [{key:'i',text:'Loss of ability to adapt'},{key:'ii',text:'Natural disasters'},{key:'iii',text:'An imbalance of the sexes'},{key:'iv',text:'Human disasters'},{key:'v',text:'Evolution'},{key:'vi',text:'The haphazard nature of reproduction'}],
            items: [{statement:'32. Paragraph A',correct_answer:'vi'},{statement:'33. Paragraph B',correct_answer:'iii'},{statement:'34. Paragraph C',correct_answer:'i'},{statement:'35. Paragraph D',correct_answer:'ii'}]
        }, points: 4
    });
    qs.push({
        passage_id: insertedPassages[2].id, order_index: 6, question_number: 36, type: 'sentence_completion',
        group_instruction: 'Questions 36-38: Complete the sentences.',
        content: {
            text_template: 'While the population of a species may be on the increase, there is always a chance that small isolated groups (36) [blank_1]\nSurvival of a species depends on a balance between the size of a population and its (37) [blank_2]\nThe likelihood that animals which live in forests will become extinct is increased when (38) [blank_3]',
            word_limit: 'NO MORE THAN THREE WORDS',
            blanks: [{blank_id: 1, correct_answers: ['will not survive', 'may not survive', 'will become extinct', 'may become extinct', 'could become extinct']},{blank_id: 2, correct_answers: ['locality', 'distribution']},{blank_id: 3, correct_answers: ['logging takes place', 'logging occurs']}]
        }, points: 3
    });
    qs.push({ passage_id: insertedPassages[2].id, order_index: 7, question_number: 39, type: 'multiple_choice', group_instruction: 'Question 39', content: { question: 'An alternative heading for the passage could be:', options: [{key:'A',text:'The protection of native flora and fauna'},{key:'B',text:'Influential factors in assessing survival probability'},{key:'C',text:'An economic rationale for the logging of forests'},{key:'D',text:'Preventive measures for the extinction of a species'}], correct_answer: 'B', explanation: '' }, points: 1 });

    // L1: 12 qs
    const l1mc3 = [
        {q:1, text:'What are the students looking for?', options:[{k:'A',t:'Main Hall'},{k:'B',t:'Great Hall'},{k:'C',t:'Old Hall'},{k:'D',t:'Old Building'}], a:'A'},
        {q:2, text:'Where is the administration building?', options:[{k:'A',t:'Picture A'},{k:'B',t:'Picture B'},{k:'C',t:'Picture C'},{k:'D',t:'Picture D'}], a:'A'},
        {q:3, text:'How many people are waiting in the queue?', options:[{k:'A',t:'50'},{k:'B',t:'100'},{k:'C',t:'200'},{k:'D',t:'300'}], a:'A'},
        {q:4, text:'What does the woman order for lunch?', options:[{k:'A',t:'Picture A'},{k:'B',t:'Picture B'},{k:'C',t:'Picture C'},{k:'D',t:'Picture D'}], a:'B'},
        {q:5, text:'What does the woman order to drink?', options:[{k:'A',t:'Picture A'},{k:'B',t:'Picture B'},{k:'C',t:'Picture C'},{k:'D',t:'Picture D'}], a:'D'},
        {q:6, text:'How much money does the woman give the man?', options:[{k:'A',t:'$2.00'},{k:'B',t:'$3.00'},{k:'C',t:'$3.50'},{k:'D',t:'$5.00'}], a:'D'}
    ];
    // Wait, the outline said 1-4 MC. Let's re-read test 4 outline. Page 81: "Questions 1-5" (Wait! Q1 is about Admin building, Q2 is queue, Q3 is lunch, Q4 is drink, Q5 is money! The example is What are they looking for).
    // So Q1 is Admin building, Q2 is Queue, Q3 is Lunch, Q4 is Drink, Q5 is Money.
    l1mc3.shift(); // Remove the example
    l1mc3.forEach((q, i) => { q.q = i+1; });
    l1mc3.forEach((q, i) => qs.push({ passage_id: insertedPassages[3].id, order_index: i+1, question_number: q.q, type: 'multiple_choice', group_instruction: 'Questions 1-5: Circle the appropriate letter', content: { question: q.text, options: q.options.map(o=>({key:o.k,text:o.t})), correct_answer: q.a, explanation: '' }, points: 1 }));
    
    qs.push({
        passage_id: insertedPassages[3].id, order_index: 6, question_number: 6, type: 'form_completion',
        group_instruction: 'Questions 6-10: Complete the registration form.',
        content: {
            text_template: 'Name of student: (6) [blank_1]\nAddress: (7) Flat 5/ [blank_2]\nTown: (8) [blank_3]\nTel: (9) [blank_4]\nCourse: (10) [blank_5]',
            word_limit: 'NO MORE THAN THREE WORDS',
            blanks: [{blank_id: 1, correct_answers: ['Julia Perkins']},{blank_id: 2, correct_answers: ['15 Waratah Road']},{blank_id: 3, correct_answers: ['Brisbane']},{blank_id: 4, correct_answers: ['to be advised', 'not connected', 'no phone', 'none']},{blank_id: 5, correct_answers: ['first year Law']}]
        }, points: 5
    });
    qs.push({ passage_id: insertedPassages[3].id, order_index: 7, question_number: 11, type: 'multiple_choice', group_instruction: 'Questions 11-12', content: { question: 'What did the man buy for her to eat?', options: [{key:'A',text:'Picture A'},{key:'B',text:'Picture B'},{key:'C',text:'Picture C'},{key:'D',text:'Picture D'}], correct_answer: 'C', explanation: '' }, points: 1 });
    qs.push({ passage_id: insertedPassages[3].id, order_index: 8, question_number: 12, type: 'multiple_choice', group_instruction: 'Questions 11-12', content: { question: 'What must the students do as part of registration at the university?', options: [{key:'A',text:'Check the notice board in the Law Faculty.'},{key:'B',text:'Find out about lectures.'},{key:'C',text:'Organise tutorial groups.'},{key:'D',text:'Pay the union fees.'}], correct_answer: 'D', explanation: '' }, points: 1 });

    // L2: 9 qs
    qs.push({
        passage_id: insertedPassages[4].id, order_index: 1, question_number: 13, type: 'note_completion',
        group_instruction: 'Questions 13-21: Complete the notes.',
        content: {
            text_template: 'STUDENT BANKING\nRecommended Banks | Location\nBarclays | Realty Square\nNational Westminster | Example: Preston Park\nLloyds | City Plaza\nMidland | (13) [blank_1]\n\nFunding\n- Must provide (14) [blank_2] I can support myself.\n\nOpening an account\n- Take with me: (15) [blank_3] and letter of enrolment.\n- Recommended account: (16) [blank_4]\n- Bank supplies: (17) [blank_5] and chequecard which guarantees cheques.\n\nOther services\n- Cashcard: (you can (18) [blank_6] cash at any time.)\n- Switch/Delta cards: (take the money (19) [blank_7] the account.)\n\nOverdraft\n- Must have (20) [blank_8]\n\nOpening times\n- Most banks open until (21) [blank_9] during the week.',
            word_limit: 'NO MORE THAN THREE WORDS',
            blanks: [{blank_id: 1, correct_answers: ['Hope Street']},{blank_id: 2, correct_answers: ['evidence']},{blank_id: 3, correct_answers: ['passport']},{blank_id: 4, correct_answers: ['current', 'student account']},{blank_id: 5, correct_answers: ['chequebook']},{blank_id: 6, correct_answers: ['withdraw', 'draw out', 'take out']},{blank_id: 7, correct_answers: ['directly from', 'right out of']},{blank_id: 8, correct_answers: ['permission of bank', 'permission from bank']},{blank_id: 9, correct_answers: ['4.30 pm', '5 pm']}]
        }, points: 9
    });

    // L3: 10 qs
    qs.push({
        passage_id: insertedPassages[5].id, order_index: 1, question_number: 22, type: 'note_completion',
        group_instruction: 'Questions 22-25: Complete the factsheet.',
        content: {
            text_template: 'FACTSHEET - Aluminium Cans\n- (22) [blank_1] produced every day in the US — more cans produced than nails or (23) [blank_2]\n- each can weighs 0.48 ounces — thinner than two (24) [blank_3]\n- can take more than 90 pounds of pressure per square inch — over (25) [blank_4] the pressure of a car tyre',
            word_limit: 'NO MORE THAN THREE WORDS',
            blanks: [{blank_id: 1, correct_answers: ['300 million']},{blank_id: 2, correct_answers: ['paper clips']},{blank_id: 3, correct_answers: ['magazine pages', 'pieces of paper', 'pages']},{blank_id: 4, correct_answers: ['three times']}]
        }, points: 4
    });
    qs.push({
        passage_id: insertedPassages[5].id, order_index: 2, question_number: 26, type: 'diagram_label_completion',
        group_instruction: 'Questions 26-31: Label the aluminium can.',
        content: {
            image_url: 'https://kigoxvdlcyjxfpetuxiu.supabase.co/storage/v1/object/public/listening-audio/cambridge-1/test4_l3_can.jpg',
            labels: [{label_id: "26", correct_answers: ["thicker"]}, {label_id: "27", correct_answers: ["label"]}, {label_id: "28", correct_answers: ["a dome"]}, {label_id: "29", correct_answers: ["flange"]}, {label_id: "30", correct_answers: ["25%"]}, {label_id: "31", correct_answers: ["scored opening"]}]
        }, points: 6
    });

    // L4: 11 qs
    qs.push({
        passage_id: insertedPassages[6].id, order_index: 1, question_number: 32, type: 'note_completion',
        group_instruction: 'Questions 32-42: Complete the lecture notes.',
        content: {
            text_template: 'Purpose of the mini lecture\nTo experience (32) [blank_1]\nTo find out about (33) [blank_2]\n\nThe three strands of Sports Studies are:\na Sports psychology\nb Sports (34) [blank_3]\nc Sports physiology\n\na The psychologists work with (35) [blank_4]\nThey want to discover what (36) [blank_5]\n\nb Sports marketing looks at (37) [blank_6]\nSport now competes with (38) [blank_7]\nSpectators want (39) [blank_8]\n\nc Sports physiology is also known as (40) [blank_9]\nMacro levels look at (41) [blank_10]\nMicro level looks at (42) [blank_11]',
            word_limit: 'NO MORE THAN THREE WORDS',
            blanks: [{blank_id: 1, correct_answers: ['a university lecture']},{blank_id: 2, correct_answers: ['Sports Studies', 'Sports Studies programme']},{blank_id: 3, correct_answers: ['management']},{blank_id: 4, correct_answers: ['top athletes']},{blank_id: 5, correct_answers: ['makes winners', 'makes them win', 'makes people win']},{blank_id: 6, correct_answers: ['market forces']},{blank_id: 7, correct_answers: ['other leisure activities', 'leisure activities']},{blank_id: 8, correct_answers: ['entertainment', 'to be entertained']},{blank_id: 9, correct_answers: ['exercise science']},{blank_id: 10, correct_answers: ['fitness testing', 'body measurements']},{blank_id: 11, correct_answers: ['cellular research', 'cellular change', 'body cells']}]
        }, points: 11
    });

    const { error } = await supabase.from('questions').insert(qs);
    if(error) console.error('Qs Error', error);
    else console.log('Test 4 Seeded successfully.');
}
run();
