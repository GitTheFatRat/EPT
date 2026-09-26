import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const PASSAGE_1 = `<h2>Right and left-handedness in humans</h2>
<p>Why do humans, virtually alone among all animal species, display a distinct left or right-handedness? Not even our closest relatives among the apes possess such decided lateral asymmetry, as psychologists call it. Yet about 90 per cent of every human population that has ever lived appears to have been right-handed. Professor Bryan Turner at Deakin University has studied the research literature on left-handedness and found that handedness goes with sidedness. So nine out of ten people are right-handed and eight are right-footed. He noted that this distinctive asymmetry in the human population is itself systematic. "Humans think in categories: black and white, up and down, left and right. It's a system of signs that enables us to categorise phenomena that are essentially ambiguous."</p>
<p>Research has shown that there is a genetic or inherited element to handedness. But while left-handedness tends to run in families, neither left nor right handers will automatically produce off-spring with the same handedness; in fact about 6 per cent of children with two right-handed parents will be left-handed. However, among two left-handed parents, perhaps 40 per cent of the children will also be left-handed. With one right and one left-handed parent, 15 to 20 per cent of the offspring will be left-handed. Even among identical twins who have exactly the same genes, one in six pairs will differ in their handedness.</p>
<p>What then makes people left-handed if it is not simply genetic? Other factors must be at work and researchers have turned to the brain for clues. In the 1860s the French surgeon and anthropologist, Dr Paul Broca, made the remarkable finding that patients who had lost their powers of speech as a result of a stroke (a blood clot in the brain) had paralysis of the right half of their body. He noted that since the left hemisphere of the brain controls the right half of the body, and vice versa, the brain damage must have been in the brain's left hemisphere. Psychologists now believe that among right-handed people, probably 95 per cent have their language centre in the left hemisphere, while 5 per cent have right-sided language. Left-handers, however, do not show the reverse pattern but instead a majority also have their language in the left hemisphere. Some 30 per cent have right hemisphere language.</p>
<p>Dr Brinkman, a brain researcher at the Australian National University in Canberra, has suggested that evolution of speech went with right-handed preference. According to Brinkman, as the brain evolved, one side became specialised for fine control of movement (necessary for producing speech) and along with this evolution came right-hand preference. According to Brinkman, most left-handers have left hemisphere dominance but also some capacity in the right hemisphere. She has observed that if a left-handed person is brain-damaged in the left hemisphere, the recovery of speech is quite often better and this is explained by the fact that left-handers have a more bilateral speech function.</p>
<p>In her studies of macaque monkeys, Brinkman has noticed that primates (monkeys) seem to learn a hand preference from their mother in the first year of life but this could be one hand or the other. In humans, however, the specialisation in function of the two hemispheres results in anatomical differences: areas that are involved with the production of speech are usually larger on the left side than on the right. Since monkeys have not acquired the art of speech, one would not expect to see such a variation but Brinkman claims to have discovered a trend in monkeys towards the asymmetry that is evident in the human brain.</p>
<p>Two American researchers, Geschwind and Galaburda, studied the brains of human embryos and discovered that the left-right asymmetry exists before birth. But as the brain develops, a number of things can affect it. Every brain is initially female in its organisation and it only becomes a male brain when the male foetus begins to secrete hormones. Geschwind and Galaburda knew that different parts of the brain mature at different rates; the right hemisphere develops first, then the left. Moreover, a girl's brain develops somewhat faster than that of a boy. So, if something happens to the brain's development during pregnancy, it is more likely to be affected in a male and the hemisphere more likely to be involved is the left. The brain may become less lateralised and this in turn could result in left-handedness and the development of certain superior skills that have their origins in the left hemisphere such as logic, rationality and abstraction. It should be no surprise then that among mathematicians and architects, left-handers tend to be more common and there are more left-handed males than females.</p>
<p>The results of this research may be some consolation to left-handers who have for centuries lived in a world designed to suit right-handed people. However, what is alarming, according to Mr. Charles Moore, a writer and journalist, is the way the word "right" reinforces its own virtue. Subliminally he says, language tells people to think that anything on the right can be trusted while anything on the left is dangerous or even sinister. We speak of left-handed compliments and according to Moore, "it is no coincidence that left-handed children, forced to use their right hand, often develop a stammer as they are robbed of their freedom of speech". However, as more research is undertaken on the causes of left-handedness, attitudes towards left-handed people are gradually changing for the better. Indeed when the champion tennis player Ivan Lendl was asked what the single thing was that he would choose in order to improve his game, he said he would like to become a left-hander.</p>`;

const PASSAGE_2 = `<h2>MIGRATORY BEEKEEPING</h2>
<h3>Taking Wing</h3>
<p>To eke out a full-time living from their honeybees, about half the nation's 2,000 commercial beekeepers pull up stakes each spring, migrating north to find more flowers for their bees. Besides turning floral nectar into honey, these hardworking insects also pollinate crops for farmers -for a fee. As autumn approaches, the beekeepers pack up their hives and go south, scrambling for pollination contracts in hot spots like California's fertile Central Valley.</p>
<p>Of the 2,000 commercial beekeepers in the United States about half migrate This pays off in two ways Moving north in the summer and south in the winter lets bees work a longer blooming season, making more honey — and money — for their keepers. Second, beekeepers can carry their hives to farmers who need bees to pollinate their crops. Every spring a migratory beekeeper in California may move up to 160 million bees to flowering fields in Minnesota and every winter his family may haul the hives back to California, where farmers will rent the bees to pollinate almond and cherry trees.</p>
<p>Migratory beekeeping is nothing new. The ancient Egyptians moved clay hives, probably on rafts, down the Nile to follow the bloom and nectar flow as it moved toward Cairo. In the 1880s North American beekeepers experimented with the same idea, moving bees on barges along the Mississippi and on waterways in Florida, but their lighter, wooden hives kept falling into the water. Other keepers tried the railroad and horse-drawn wagons, but that didn't prove practical. Not until the 1920s when cars and trucks became affordable and roads improved, did migratory beekeeping begin to catch on.</p>
<p>For the Californian beekeeper, the pollination season begins in February. At this time, the beehives are in particular demand by farmers who have almond groves; they need two hives an acre. For the three-week long bloom, beekeepers can hire out their hives for $32 each. It's a bonanza for the bees too. Most people consider almond honey too bitter to eat so the bees get to keep it for themselves.</p>
<p>By early March it is time to move the bees. It can take up to seven nights to pack the 4,000 or so hives that a beekeeper may own. These are not moved in the middle of the day because too many of the bees would end up homeless. But at night, the hives are stacked onto wooden pallets, back-to-back in sets of four, and lifted onto a truck. It is not necessary to wear gloves or a beekeeper's veil because the hives are not being opened and the bees should remain relatively quiet. Just in case some are still lively, bees can be pacified with a few puffs of smoke blown into each hive's narrow entrance.</p>
<p>In their new location, the beekeeper will pay the farmer to allow his bees to feed in such places as orange groves. The honey produced here is fragrant and sweet and can be sold by the beekeepers. To encourage the bees to produce as much honey as possible during this period, the beekeepers open the hives and stack extra boxes called supers on top. These temporary hive extensions contain frames of empty comb for the bees to fill with honey. In the brood chamber below, the bees will stash honey to eat later. To prevent the queen from crawling up to the top and laying eggs, a screen can be inserted between the brood chamber and the supers. Three weeks later the honey can be gathered.</p>
<p>Foul smelling chemicals are often used to irritate the bees and drive them down into the hive's bottom boxes, leaving the honey-filled supers more or less bee free. These can then be pulled off the hive. They are heavy with honey and may weigh up to 90 pounds each. The supers are taken to a warehouse. In the extracting room, the frames are lilted out and lowered into an "uncapper" where rotating blades shave away the wax that covers each cell. The uncapped frames are put in a carousel that sits on the bottom of a large stainless steel drum. The carousel is filled to capacity with 72 frames. A switch is flipped and the frames begin to whirl at 300 revolutions per minute; centrifugal force throws the honey out of the combs. Finally the honey is poured into barrels for shipment.</p>
<p>After this, approximately a quarter of the hives weakened by disease, mites, or an ageing or dead queen, will have to be replaced. To create new colonies, a healthy double hive, teeming with bees, can be separated into two boxes. One half will hold the queen and a young, already mated queen can be put in the other half, to make two hives from one. By the time the flowers bloom, the new queens will be laying eggs, filling each hive with young worker bees. The beekeeper's family will then migrate with them to their summer location.</p>`;

const PASSAGE_3 = `<h2>TOURISM</h2>
<p>A Tourism, holidaymaking and travel are these days more significant social phenomena than most commentators have considered. On the face of it there could not be a more trivial subject for a book. And indeed since social scientists have had considerable difficulty explaining weightier topics such as work or politics it might be thought that they would have great difficulties in accounting for more trivial phenomena such as holidaymaking. However there are interesting parallels with the study of deviance. This involves the investigation of bizarre and idiosyncratic social practices which happen to be defined as deviant in some societies but not necessarily in others. The assumption is that the investigation of deviance can reveal interesting and significant aspects of normal societies. It could be said that a similar analysis can be applied to tourism.</p>
<p>B Tourism is a leisure activity which presupposes its opposite namely regulated and organised work. It is one manifestation of how work and leisure are organised as separate and regulated spheres of social practice in modern societies. Indeed acting as a tourist is one of the defining characteristics of being 'modern' and the popular concept of tourism is that it is organised within particular places and occurs for regularised periods of time. Tourist relationships arise from a movement of people to and their stay in various destinations. This necessarily involves some movement that is the journey and a period of stay in a new place or places. The journey and the stay are by definition outside the normal places of residence and work and are of a short term and temporary nature and there is a clear intention to return "home" within a relatively short period of time.</p>
<p>C A substantial proportion of the population of modern societies engages in such tourist practices; new socialised forms of provision have developed in order to cope with the mass character of the gazes of tourists as opposed to the individual character of travel. Places are chosen to be visited and be gazed upon because there is an anticipation especially through daydreaming and fantasy of intense pleasures, either on a different scale or involving different senses from those customarily encountered. Such anticipation is constructed and sustained through a variety of non-tourist practices such as films, TV, literature, magazines, records and videos which construct and reinforce this daydreaming.</p>
<p>D Tourists tend to visit features of landscape and townscape which separate them off from everyday experience. Such aspects are viewed because they are taken to be in some sense out of the ordinary. The viewing of these tourist sights often involves different forms of social patterning with a much greater sensitivity to visual elements of landscape or townscape than is normally found in everyday life. People linger over these sights in a way that they would not normally do in their home environment and the vision is objectified or captured through photographs, postcards, films and so on which enable the memory to be endlessly reproduced and recaptured.</p>
<p>E One of the earliest dissertations on the subject of tourism is Boorstin's analysis of the pseudo event (1964) where he argues that contemporary Americans cannot experience 'reality' directly but thrive on "pseudo events". Isolated from the host environment and the local people, the mass tourist travels in guided groups and finds pleasure in inauthentic contrived attractions, gullibly enjoying the pseudo events and disregarding the real world outside. Over time the images generated of different tourist sights come to constitute a closed self-perpetuating system of illusions which provide the tourist with the basis for selecting and evaluating potential places to visit. Such visits are made, says Boorstin, within the "environmental bubble" of the familiar American style hotel which insulates the tourist from the strangeness of the host environment.</p>
<p>F To service the burgeoning tourist industry, an array of professionals has developed who attempt to reproduce ever-new objects for the tourist to look at. These objects or places are located in a complex and changing hierarchy. This depends upon the interplay between, on the one hand, competition between interests involved in the provision of such objects and, on the other hand, changing class, gender, and generational distinctions of taste within the potential population of visitors. It has been said that to be a tourist is one of the characteristics of the "modern experience". Not to go away is like not possessing a car or a nice house. Travel is a marker of status in modern societies and is also thought to be necessary for good health. The role of the professional, therefore, is to cater for the needs and tastes of the tourists in accordance with their class and overall expectations.</p>`;

async function run() {
    console.log('Seeding Test 2...');
    const exams = [
        { code: 'CAMBRIDGE-1-T2-R1', title: 'Cambridge IELTS 1 - Test 2 - Reading Passage 1' },
        { code: 'CAMBRIDGE-1-T2-R2', title: 'Cambridge IELTS 1 - Test 2 - Reading Passage 2' },
        { code: 'CAMBRIDGE-1-T2-R3', title: 'Cambridge IELTS 1 - Test 2 - Reading Passage 3' },
        { code: 'CAMBRIDGE-1-T2-L1', title: 'Cambridge IELTS 1 - Test 2 - Listening Section 1' },
        { code: 'CAMBRIDGE-1-T2-L2', title: 'Cambridge IELTS 1 - Test 2 - Listening Section 2' },
        { code: 'CAMBRIDGE-1-T2-L3', title: 'Cambridge IELTS 1 - Test 2 - Listening Section 3' },
        { code: 'CAMBRIDGE-1-T2-L4', title: 'Cambridge IELTS 1 - Test 2 - Listening Section 4' },
        { code: 'CAMBRIDGE-1-T2-FULL', title: 'Cambridge IELTS 1 - Test 2 - Full Mock Test' }
    ];

    const insertedExams = {};
    for (const ex of exams) {
        const { data } = await supabase.from('exams').insert({
            code: ex.code, title: ex.title, is_published: true
        }).select().single();
        insertedExams[ex.code] = data.id;
    }

    // Passages
    const passagesData = [
        { skill: 'reading', title: 'Right and left-handedness in humans', passage_text: PASSAGE_1 },
        { skill: 'reading', title: 'Migratory beekeeping', passage_text: PASSAGE_2 },
        { skill: 'reading', title: 'TOURISM', passage_text: PASSAGE_3 },
        { skill: 'listening', title: 'Listening Section 1', audio_url: 'https://kigoxvdlcyjxfpetuxiu.supabase.co/storage/v1/object/public/listening-audio/cambridge-1/Test%202%20-%20Section%201.mp3' },
        { skill: 'listening', title: 'Listening Section 2', audio_url: 'https://kigoxvdlcyjxfpetuxiu.supabase.co/storage/v1/object/public/listening-audio/cambridge-1/Test%202%20-%20Section%202.mp3' },
        { skill: 'listening', title: 'Listening Section 3', audio_url: 'https://kigoxvdlcyjxfpetuxiu.supabase.co/storage/v1/object/public/listening-audio/cambridge-1/Test%202%20-%20Section%203.mp3' },
        { skill: 'listening', title: 'Listening Section 4', audio_url: 'https://kigoxvdlcyjxfpetuxiu.supabase.co/storage/v1/object/public/listening-audio/cambridge-1/Test%202%20-%20Section%204.mp3' }
    ];

    const insertedPassages = [];
    for (const p of passagesData) {
        const { data } = await supabase.from('passages').insert(p).select().single();
        insertedPassages.push(data);
    }

    // Links
    const links = [
        { exam: 'CAMBRIDGE-1-T2-R1', passage: 0, order: 1 },
        { exam: 'CAMBRIDGE-1-T2-R2', passage: 1, order: 1 },
        { exam: 'CAMBRIDGE-1-T2-R3', passage: 2, order: 1 },
        { exam: 'CAMBRIDGE-1-T2-L1', passage: 3, order: 1 },
        { exam: 'CAMBRIDGE-1-T2-L2', passage: 4, order: 1 },
        { exam: 'CAMBRIDGE-1-T2-L3', passage: 5, order: 1 },
        { exam: 'CAMBRIDGE-1-T2-L4', passage: 6, order: 1 },
        { exam: 'CAMBRIDGE-1-T2-FULL', passage: 0, order: 1 },
        { exam: 'CAMBRIDGE-1-T2-FULL', passage: 1, order: 2 },
        { exam: 'CAMBRIDGE-1-T2-FULL', passage: 2, order: 3 },
        { exam: 'CAMBRIDGE-1-T2-FULL', passage: 3, order: 4 },
        { exam: 'CAMBRIDGE-1-T2-FULL', passage: 4, order: 5 },
        { exam: 'CAMBRIDGE-1-T2-FULL', passage: 5, order: 6 },
        { exam: 'CAMBRIDGE-1-T2-FULL', passage: 6, order: 7 }
    ];
    for (const link of links) {
        await supabase.from('exam_passages').insert({
            exam_id: insertedExams[link.exam],
            passage_id: insertedPassages[link.passage].id,
            order_index: link.order
        });
    }

    // Questions
    const qs = [];
    
    // R1: 12 qs
    qs.push({
        passage_id: insertedPassages[0].id, order_index: 1, question_number: 1, type: 'matching_features',
        group_instruction: 'Questions 1-7: Match the people with the opinions.',
        content: {
            prompt: 'Use the information in the text to match the people (A-E) with the opinions (1-7).',
            options: [{key:'A',text:'Dr Broca'},{key:'B',text:'Dr Brinkman'},{key:'C',text:'Geschwind and Galaburda'},{key:'D',text:'Charles Moore'},{key:'E',text:'Professor Turner'}],
            items: [
                { statement: '1. Human beings started to show a preference for right-handedness when they first developed language.', correct_answer: 'B' },
                { statement: '2. Society is prejudiced against left-handed people.', correct_answer: 'D' },
                { statement: '3. Boys are more likely to be left-handed.', correct_answer: 'C' },
                { statement: '4. After a stroke, left-handed people recover their speech more quickly than right-handed people.', correct_answer: 'B' },
                { statement: '5. People who suffer strokes on the left side of the brain usually lose their power of speech.', correct_answer: 'A' },
                { statement: '6. The two sides of the brain develop different functions before birth.', correct_answer: 'C' },
                { statement: '7. Asymmetry is a common feature of the human body.', correct_answer: 'E' }
            ]
        }, points: 7
    });
    qs.push({
        passage_id: insertedPassages[0].id, order_index: 2, question_number: 8, type: 'table_completion',
        group_instruction: 'Questions 8-10: Complete the table below.',
        content: {
            text_template: 'Percentage of children left-handed\nOne parent left-handed, One parent right-handed: (8) [blank_1]\nBoth parents left-handed: (9) [blank_2]\nBoth parents right-handed: (10) [blank_3]',
            word_limit: 'NO MORE THAN THREE WORDS',
            blanks: [{blank_id: 1, correct_answers: ['15-20%']},{blank_id: 2, correct_answers: ['40%']},{blank_id: 3, correct_answers: ['6%']}]
        }, points: 3
    });
    qs.push({ passage_id: insertedPassages[0].id, order_index: 3, question_number: 11, type: 'multiple_choice', group_instruction: 'Questions 11-12: Choose A-D', content: { question: 'A study of monkeys has shown that', options: [{key:'A',text:'monkeys are not usually right-handed.'},{key:'B',text:'monkeys display a capacity for speech.'},{key:'C',text:'monkey brains are smaller than human brains.'},{key:'D',text:'monkey brains are asymmetric.'}], correct_answer: 'D', explanation: '' }, points: 1 });
    qs.push({ passage_id: insertedPassages[0].id, order_index: 4, question_number: 12, type: 'multiple_choice', group_instruction: 'Questions 11-12: Choose A-D', content: { question: 'According to the writer, left-handed people', options: [{key:'A',text:'will often develop a stammer.'},{key:'B',text:'have undergone hardship for years.'},{key:'C',text:'are untrustworthy.'},{key:'D',text:'are good tennis players.'}], correct_answer: 'B', explanation: '' }, points: 1 });

    // R2: 15 qs
    qs.push({
        passage_id: insertedPassages[1].id, order_index: 1, question_number: 13, type: 'note_completion',
        group_instruction: 'Questions 13-19: Complete the flow chart. Choose your answers from the box.',
        content: {
            text_template: 'BEEKEEPER MOVEMENTS\nIn March, beekeepers (13) [blank_1] for migration at night when the hives are (14) [blank_2] and the bees are generally tranquil. A little (15) [blank_3] can ensure that this is the case.\n\nThey transport their hives to orange groves where farmers (16) [blank_4] beekeepers for placing them on their land. Here the bees make honey.\n\nAfter three weeks, the supers can be taken to a warehouse where (17) [blank_5] are used to remove the wax and extract the honey from the (18) [blank_6] .\n\nAfter the honey collection, the old hives are rejected. Good double hives are (19) [blank_7] and re-queened and the beekeeper transports them to their summer base.',
            word_limit: 'ONE WORD',
            blanks: [{blank_id: 1, correct_answers: ['prepare']}, {blank_id: 2, correct_answers: ['full']}, {blank_id: 3, correct_answers: ['smoke']}, {blank_id: 4, correct_answers: ['charge']}, {blank_id: 5, correct_answers: ['machines']}, {blank_id: 6, correct_answers: ['combs']}, {blank_id: 7, correct_answers: ['split']}]
        }, points: 7
    });
    qs.push({
        passage_id: insertedPassages[1].id, order_index: 2, question_number: 20, type: 'diagram_label_completion',
        group_instruction: 'Questions 20-23: Label the diagram below.',
        content: {
            image_url: 'https://kigoxvdlcyjxfpetuxiu.supabase.co/storage/v1/object/public/listening-audio/cambridge-1/test2_r2_beehive.jpg',
            labels: [{label_id: "20", correct_answers: ["hexagonal cells", "cells", "comb"]}, {label_id: "21", correct_answers: ["frames", "frames of comb"]}, {label_id: "22", correct_answers: ["screen"]}, {label_id: "23", correct_answers: ["brood chamber"]}]
        }, points: 4
    });
    const yn24 = [{q:24,s:'The Egyptians keep bees on the banks of the Nile.',a:'NOT GIVEN'}, {q:25,s:'First attempts at migratory beekeeping in America were unsuccessful.',a:'YES'}, {q:26,s:'Bees keep honey for themselves in the bottom of the hive.',a:'YES'}, {q:27,s:'The honey is spun to make it liquid.',a:'NO'}];
    yn24.forEach((q, i) => qs.push({ passage_id: insertedPassages[1].id, order_index: 3 + i, question_number: q.q, type: 'yes_no_not_given', group_instruction: 'Questions 24-27: YES, NO, NOT GIVEN', content: { statement: q.s, correct_answer: q.a, explanation: '' }, points: 1 }));

    // R3: 14 qs
    qs.push({
        passage_id: insertedPassages[2].id, order_index: 1, question_number: 28, type: 'matching_headings',
        group_instruction: 'Questions 28-32: Choose the most suitable heading for each paragraph.',
        content: {
            headings: [{key:'i',text:'The politics of tourism'},{key:'ii',text:'The cost of tourism'},{key:'iii',text:'Justifying the study of tourism'},{key:'iv',text:'Tourism contrasted with travel'},{key:'v',text:'The essence of modern tourism'},{key:'vi',text:'Tourism versus leisure'},{key:'vii',text:'The artificiality of modern tourism'},{key:'viii',text:'The role of modern tour guides'},{key:'ix',text:'Creating an alternative to the everyday experience'}],
            items: [{paragraph:'A',correct_answer:'iii'},{paragraph:'B',correct_answer:'v'},{paragraph:'C',correct_answer:'iv'},{paragraph:'E',correct_answer:'vii'},{paragraph:'F',correct_answer:'viii'}]
        }, points: 5
    });
    const yn33 = [{q:33,s:'Tourism is a trivial subject.',a:'NO'},{q:34,s:'An analysis of deviance can act as a model for the analysis of tourism.',a:'YES'},{q:35,s:'Tourists usually choose to travel overseas.',a:'NOT GIVEN'},{q:36,s:'Tourists focus more on places they visit than those at home.',a:'YES'},{q:37,s:'Tour operators try to cheat tourists.',a:'NOT GIVEN'}];
    yn33.forEach((q, i) => qs.push({ passage_id: insertedPassages[2].id, order_index: 2 + i, question_number: q.q, type: 'yes_no_not_given', group_instruction: 'Questions 33-37: YES, NO, NOT GIVEN', content: { statement: q.s, correct_answer: q.a, explanation: '' }, points: 1 }));
    qs.push({
        passage_id: insertedPassages[2].id, order_index: 8, question_number: 38, type: 'sentence_completion',
        group_instruction: 'Questions 38-41: Choose one phrase (A-H) from the list of phrases to complete each key point below.',
        content: {
            text_template: 'List of Phrases: A. local people and their environment, B. the expectations of tourists, C. the phenomena of holidaymaking, D. the distinction we make between work and leisure, E. the individual character of travel, F. places seen in everyday life, G. photographs which recapture our holidays, H. sights designed specially for tourists.\n\n38. Our concept of tourism arises from (38) [blank_1]\n39. The media can be used to enhance (39) [blank_2]\n40. People view tourist landscapes in a different way from (40) [blank_3]\n41. Group tours encourage participants to look at (41) [blank_4]',
            word_limit: 'ONE LETTER',
            blanks: [{blank_id:1,correct_answers:['D']},{blank_id:2,correct_answers:['B']},{blank_id:3,correct_answers:['F']},{blank_id:4,correct_answers:['H']}]
        }, points: 4
    });

    // L1: 10 qs
    qs.push({
        passage_id: insertedPassages[3].id, order_index: 1, question_number: 1, type: 'note_completion',
        group_instruction: 'Questions 1-10: Complete the notes.',
        content: {
            text_template: 'KATE\nType of accommodation: (1) [blank_1]\nHer feelings about the accommodation: (2) [blank_2]\nHer feelings about the other students: (3) [blank_3]\nDifficulties experienced on the course: (4) [blank_4]\nSuggestions for improving the course: (5) [blank_5]\n\nLUKI\nFirst type of accommodation: (6) [blank_6]\nProblem with the first accommodation: (7) [blank_7]\nSecond type of accommodation: (8) [blank_8]\nName of course: (9) [blank_9]\nSuggestions for improving the course: (10) [blank_10]',
            word_limit: 'NO MORE THAN THREE WORDS',
            blanks: [
                {blank_id:1,correct_answers:['student accommodation', 'hostel']},
                {blank_id:2,correct_answers:['awful food']},
                {blank_id:3,correct_answers:['not friendly', 'kept to themselves']},
                {blank_id:4,correct_answers:['lecturers too busy', 'lecturers busy']},
                {blank_id:5,correct_answers:['regular meetings', 'meetings with lecturers', 'fortnightly meetings']},
                {blank_id:6,correct_answers:['family', 'homestay']},
                {blank_id:7,correct_answers:['lot of noise', 'children made noise', 'difficult to study']},
                {blank_id:8,correct_answers:['student house']},
                {blank_id:9,correct_answers:['Bachelor of Computing', 'Computing']},
                {blank_id:10,correct_answers:['reserve computer time']}
            ]
        }, points: 10
    });

    // L2: 11 qs
    qs.push({
        passage_id: insertedPassages[4].id, order_index: 1, question_number: 11, type: 'note_completion',
        group_instruction: 'Questions 11-20: Complete the notes below.',
        content: {
            text_template: 'There are many kinds of bicycles available:\nracing\ntouring\n(11) [blank_1]\nordinary\n\nThey vary in price and (12) [blank_2].\nPrices range from $50.00 to (13) [blank_3].\nSingle speed cycles are suitable for (14) [blank_4].\nThree speed cycles are suitable for (15) [blank_5].\nFive and ten speed cycles are suitable for longer distances, hills and (16) [blank_6].\nTen speed bikes are better because they are (17) [blank_7] in price but (18) [blank_8].\nBuying a cycle is like (19) [blank_9].\nThe size of the bicycle is determined by the size of the (20) [blank_10].',
            word_limit: 'NO MORE THAN THREE WORDS',
            blanks: [
                {blank_id:1,correct_answers:['mountain']},
                {blank_id:2,correct_answers:['quality']},
                {blank_id:3,correct_answers:['$2,000', '2000', '2,000']},
                {blank_id:4,correct_answers:['short rides', 'casual rides']},
                {blank_id:5,correct_answers:['town riding', 'shopping']},
                {blank_id:6,correct_answers:['serious touring']},
                {blank_id:7,correct_answers:['similar', 'almost the same']},
                {blank_id:8,correct_answers:['better quality', 'better quality components']},
                {blank_id:9,correct_answers:['buying clothes']},
                {blank_id:10,correct_answers:['frame']}
            ]
        }, points: 10
    });

    // L3: 12 qs
    const l3mc = [
        {q:21, text:'At first Fiona thinks that Martin\'s tutorial topic is', options:[{k:'A',t:'inappropriate.'},{k:'B',t:'dull.'},{k:'C',t:'interesting.'},{k:'D',t:'fascinating.'}], a:'B'},
        {q:22, text:'According to Martin, the banana', options:[{k:'A',t:'has only recently been cultivated.'},{k:'B',t:'is economical to grow.'},{k:'C',t:'is good for your health.'},{k:'D',t:'is his favourite food.'}], a:'C'},
        {q:23, text:'Fiona listens to Martin because she', options:[{k:'A',t:'wants to know more about bananas.'},{k:'B',t:'has nothing else to do today.'},{k:'C',t:'is interested in the economy of Australia.'},{k:'D',t:'wants to help Martin.'}], a:'D'},
        {q:24, text:'According to Martin, bananas were introduced into Australia from', options:[{k:'A',t:'India.'},{k:'B',t:'England.'},{k:'C',t:'China.'},{k:'D',t:'Africa.'}], a:'B'}
    ];
    l3mc.forEach((q, i) => qs.push({ passage_id: insertedPassages[5].id, order_index: i+1, question_number: q.q, type: 'multiple_choice', group_instruction: 'Questions 21-24: Circle the correct answer.', content: { question: q.text, options: q.options.map(o=>({key:o.k,text:o.t})), correct_answer: q.a, explanation: '' }, points: 1 }));
    qs.push({
        passage_id: insertedPassages[5].id, order_index: 5, question_number: 25, type: 'note_completion',
        group_instruction: 'Questions 25-30: Complete Martin\'s notes.',
        content: {
            text_template: 'Each banana tree produces (25) [blank_1] of bananas.\nOn modern plantations in tropical conditions a tree can bear fruit after (26) [blank_2].\nBanana trees prefer to grow (27) [blank_3] and they require rich soil and (28) [blank_4]. The fruit is often protected by (29) [blank_5].\nRipe bananas emit a gas which helps other (30) [blank_6].',
            word_limit: 'NO MORE THAN THREE WORDS',
            blanks: [
                {blank_id:1,correct_answers:['one bunch']},
                {blank_id:2,correct_answers:['15 months', 'fifteen months']},
                {blank_id:3,correct_answers:['uphill', 'on hillsides']},
                {blank_id:4,correct_answers:['lots of water', 'plenty of water']},
                {blank_id:5,correct_answers:['plastic bags']},
                {blank_id:6,correct_answers:['bananas to ripen', 'ones to ripen']}
            ]
        }, points: 6
    });
    qs.push({
        passage_id: insertedPassages[5].id, order_index: 6, question_number: 31, type: 'note_completion',
        group_instruction: 'Questions 31 and 32: Circle the TWO correct boxes.',
        content: {
            text_template: 'Consumption of Australian bananas (Choose 2 letters from A-E)\nA Europe\nB Asia\nC New Zealand\nD Australia\nE Other\n31. [blank_1]\n32. [blank_2]',
            word_limit: 'ONE LETTER',
            blanks: [
                {blank_id:1,correct_answers:['C','c','D','d']},
                {blank_id:2,correct_answers:['C','c','D','d']}
            ]
        }, points: 2
    });

    // L4: 9 qs
    const l4mc = [
        {q:33, text:'The focus of the lecture series is on', options:[{k:'A',t:'organising work and study.'},{k:'B',t:'maintaining a healthy lifestyle.'},{k:'C',t:'coping with homesickness.'},{k:'D',t:'settling in at university.'}], a:'B'},
        {q:34, text:'The lecture will be given by', options:[{k:'A',t:'the president of the Union.'},{k:'B',t:'the campus doctor.'},{k:'C',t:'a sports celebrity.'},{k:'D',t:'a health expert.'}], a:'D'},
        {q:35, text:'This week\'s lecture is on', options:[{k:'A',t:'campus food.'},{k:'B',t:'dieting.'},{k:'C',t:'sensible eating.'},{k:'D',t:'saving money.'}], a:'C'}
    ];
    l4mc.forEach((q, i) => qs.push({ passage_id: insertedPassages[6].id, order_index: i+1, question_number: q.q, type: 'multiple_choice', group_instruction: 'Questions 33-35: Circle the correct answer', content: { question: q.text, options: q.options.map(o=>({key:o.k,text:o.t})), correct_answer: q.a, explanation: '' }, points: 1 }));
    qs.push({
        passage_id: insertedPassages[6].id, order_index: 4, question_number: 36, type: 'note_completion',
        group_instruction: 'Questions 36-39: Complete the notes.',
        content: {
            text_template: 'A balanced diet\nA balanced diet will give you enough vitamins for normal daily living.\nVitamins in food can be lost through (36) [blank_1].\nTypes of vitamins:\n(a) Fat soluble vitamins are stored by the body.\n(b) Water soluble vitamins - not stored, so you need a (37) [blank_2].\nGetting enough vitamins\nEat (38) [blank_3] of foods.\nBuy plenty of vegetables and store them in (39) [blank_4].',
            word_limit: 'NO MORE THAN THREE WORDS',
            blanks: [
                {blank_id:1,correct_answers:['cooking']},
                {blank_id:2,correct_answers:['regular daily intake', 'daily intake']},
                {blank_id:3,correct_answers:['variety', 'a variety']},
                {blank_id:4,correct_answers:['the dark', 'the fridge', 'a cool place', 'a dark place']}
            ]
        }, points: 4
    });
    qs.push({
        passage_id: insertedPassages[6].id, order_index: 5, question_number: 40, type: 'diagram_label_completion',
        group_instruction: 'Questions 40-41: Complete the diagram.',
        content: {
            image_url: 'https://kigoxvdlcyjxfpetuxiu.supabase.co/storage/v1/object/public/listening-audio/cambridge-1/test2_l4_pyramid.jpg',
            labels: [
                {label_id: "40", correct_answers: ["eat in moderation", "not too much"]},
                {label_id: "41", correct_answers: ["eat lots", "eat most"]}
            ]
        }, points: 2
    });

    const { error } = await supabase.from('questions').insert(qs);
    if(error) console.error('Qs Error', error);
    else console.log('Test 2 Seeded successfully.');
}
run();
