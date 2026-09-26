import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const PASSAGE_1 = `<h2>SPOKEN CORPUS COMES TO LIFE</h2>
<p>A The compiling of dictionaries has been historically the provenance of studious professorial types - usually bespectacled - who love to pore over weighty tomes and make pronouncements on the finer nuances of meaning. They were probably good at crosswords and definitely knew a lot of words, but the image was always rather dry and dusty. The latest technology, and simple technology at that, is revolutionising the content of dictionaries and the way they are put together.</p>
<p>B For the first time, dictionary publishers are incorporating real, spoken English into their data. It gives lexicographers (people who write dictionaries) access to a more vibrant, up-to-date vernacular language which has never really been studied before. In one project, 150 volunteers each agreed to discreetly tie a Walkman recorder to their waist and leave it running for anything up to two weeks. Every conversation they had was recorded. When the data was collected, the length of tapes was 35 times the depth of the Atlantic Ocean. Teams of audio typists transcribed the tapes to produce a computerised database of ten million words.</p>
<p>C This has been the basis - along with an existing written corpus - for the Language Activator dictionary, described by lexicographer Professor Randolph Quirk as "the book the world has been waiting for". It shows advanced foreign learners of English how the language is really used. In the dictionary, key words such as "eat" are followed by related phrases such as "wolf down" or "be a picky eater", allowing the student to choose the appropriate phrase.</p>
<p>D "This kind of research would be impossible without computers," said Delia Summers, a director of dictionaries. "It has transformed the way lexicographers work. If you look at the word "like", you may intuitively think that the first and most frequent meaning is the verb, as in "I like swimming". It is not. It is the preposition, as in: "she walked like a duck". Just because a word or phrase is used doesn't mean it ends up in a dictionary. The sifting out process is as vital as ever. But the database does allow lexicographers to search for a word and find out how frequently it is used - something that could only be guessed at intuitively before.</p>
<p>E Researchers have found that written English works in a very different way to spoken English. The phrase "say what you like" literally means "feel free to say anything you want", but in reality it is used, evidence shows, by someone to prevent the other person voicing disagreement. The phrase "it's a question of" crops up on the database over and over again. It has nothing to do with enquiry, but it's one of the most frequent English phrases which has never been in a language learner's dictionary before: it is now.</p>
<p>F The Spoken Corpus computer shows how inventive and humorous people are when they are using language by twisting familiar phrases for effect. It also reveals the power of the pauses and noises we use to play for time, convey emotion, doubt and irony.</p>
<p>G For the moment, those benefiting most from the Spoken Corpus are foreign learners. "Computers allow lexicographers to search quickly through more examples of real English," said Professor Geoffrey Leech of Lancaster University. "They allow dictionaries to be more accurate and give a feel for how language is being used." The Spoken Corpus is part of the larger British National Corpus, an initiative carried out by several groups involved in the production of language learning materials: publishers, universities and the British Library.</p>`;

const PASSAGE_2 = `<h2>Moles happy as homes go underground</h2>
<p>A The first anybody knew about Dutchman Frank Siegmund and his family was when workmen tramping through a field found a narrow steel chimney protruding through the grass. Closer inspection revealed a chink of sky-light window among the thistles, and when amazed investigators moved down the side of the hill they came across a pine door complete with leaded diamond glass and a brass knocker set into an underground building. The Siegmunds had managed to live undetected for six years outside the border town of Breda, in Holland. They are the latest in a clutch of individualistic homemakers who have burrowed underground in search of tranquillity.</p>
<p>B Most, falling foul of strict building regulations, have been forced to dismantle their individualistic homes and return to more conventional lifestyles. But subterranean suburbia, Dutch-style, is about to become respectable and chic. Seven luxury homes cosseted away inside a high earth-covered noise embankment next to the main Tilburg city road recently went on the market for $296,500 each. The foundations had yet to be dug, but customers queued up to buy the unusual part-submerged houses, whose back wall consists of a grassy mound and whose front is a long glass gallery.</p>
<p>C The Dutch are not the only would-be moles. Growing numbers of Europeans are burrowing below ground to create houses, offices, discos and shopping malls. It is already proving a way of life in extreme climates; in winter months in Montreal, Canada, for instance, citizens can escape the cold in an underground complex complete with shops and even health clinics. In Tokyo builders are planning a massive underground city to be begun in the next decade, and underground shopping malls are already common in Japan, where 90 percent of the population is squeezed into 20 percent of the landspace.</p>
<p>D Building big commercial buildings underground can be a way to avoid disfiguring or threatening a beautiful or "environmentally sensitive" landscape. Indeed many of the buildings which consume most land - such as cinemas, supermarkets, theatres, warehouses or libraries - have no need to be on the surface since they do not need windows.</p>
<p>E There are big advantages, too, when it comes to private homes. A development of 194 houses which would take up 14 hectares of land above ground would occupy 2.7 hectares below it, while the number of roads would be halved. Under several metres of earth, noise is minimal and insulation is excellent. "We get 40 to 50 enquiries a week," says Peter Carpenter, secretary of the British Earth Sheltering Association, which builds similar homes in Britain. "People see this as a way of building for the future." An underground dweller himself, Carpenter has never paid a heating bill, thanks to solar panels and natural insulation.</p>
<p>F In Europe the obstacle has been conservative local authorities and developers who prefer to ensure quick sales with conventional mass produced housing. But the Dutch development was greeted with undisguised relief by South Limburg planners because of Holland's chronic shortage of land. It was the Tilburg architect Jo Hurkmans who hit on the idea of making use of noise embankments on main roads. His two-floored, four-bedroomed, two-bathroomed detached homes are now taking shape. "They are not so much below the earth as in it," he says. "All the light will come through the glass front, which runs from the second floor ceiling to the ground. Areas which do not need much natural lighting are at the back. The living accommodation is to the front so nobody notices that the back is dark."</p>
<p>G In the US, where energy-efficient homes became popular after the oil crisis of 1973, 10,000 underground houses have been built. A terrace of five homes, Britain's first subterranean development, is under way in Nottinghamshire. Italy's outstanding example of subterranean architecture is the Olivetti residential centre in Ivrea. Commissioned by Roberto Olivetti in 1969, it comprises 82 one-bedroomed apartments and 12 maisonettes and forms a house/hotel for Olivetti employees. It is built into a hill and little can be seen from outside except a glass facade. Patnzia Vallecchi, a resident since 1992, says it is little different from living in a conventional apartment.</p>
<p>H Not everyone adapts so well, and in Japan scientists at the Shimizu Corporation have developed "space creation" systems which mix light, sounds, breezes and scents to stimulate people who spend long periods below ground. Underground offices in Japan are being equipped with "virtual" windows and mirrors, while underground departments in the University of Minnesota have periscopes to reflect views and light.</p>
<p>I But Frank Siegmund and his family love their hobbit lifestyle. Their home evolved when he dug a cool room for his bakery business in a hill he had created. During a heatwave they took to sleeping there. "We felt at peace and so close to nature," he says. "Gradually I began adding to the rooms. It sounds strange but we are so close to the earth we draw strength from its vibrations. Our children love it; not every child can boast of being watched through their playroom windows by rabbits.</p>`;

const PASSAGE_3 = `<h2>A Workaholic Economy</h2>
<p>FOR THE first century or so of the industrial revolution, increased productivity led to decreases in working hours. Employees who had been putting in 12-hour days, six days a week, found their time on the job shrinking to 10 hours daily, then, finally, to eight hours, five days a week. Only a generation ago social planners worried about what people would do with all this new-found free time. In the US, at least, it seems they need not have bothered.</p>
<p>Although the output per hour of work has more than doubled since 1945, leisure seems reserved largely for the unemployed and underemployed. Those who work full-time spend as much time on the job as they did at the end of World War II. In fact, working hours have increased noticeably since 1970 — perhaps because real wages have stagnated since that year. Bookstores now abound with manuals describing how to manage time and cope with stress.</p>
<p>There are several reasons for lost leisure. Since 1979, companies have responded to improvements in the business climate by having employees work overtime rather than by hiring extra personnel, says economist Juliet B. Schor of Harvard University. Indeed, the current economic recovery has gained a certain amount of notoriety for its "jobless" nature: increased production has been almost entirely decoupled from employment. Some firms are even downsizing as their profits climb. "All things being equal, we'd be better off spreading around the work," observes labour economist Ronald G. Ehrenberg of Cornell University.</p>
<p>Yet a host of factors pushes employers to hire fewer workers for more hours and, at the same time, compels workers to spend more time on the job. Most of those incentives involve what Ehrenberg calls the structure of compensation: quirks in the way salaries and benefits are organised that make it more profitable to ask 40 employees to labour an extra hour each than to hire one more worker to do the same 40-hour job.</p>
<p>Professional and managerial employees supply the most obvious lesson along these lines. Once people are on salary, their cost to a firm is the same whether they spend 35 hours a week in the office or 70. Diminishing returns may eventually set in as overworked employees lose efficiency or leave for more arable pastures. But in the short run, the employer's incentive is clear.</p>
<p>Even hourly employees receive benefits - such as pension contributions and medical insurance - that are not tied to the number of hours they work. Therefore, it is more profitable for employers to work their existing employees harder.</p>
<p>For all that employees complain about long hours, they, too, have reasons not to trade money for leisure. "People who work reduced hours pay a huge penalty in career terms," Schor maintains. "It's taken as a negative signal about their commitment to the firm." Lotte Bailyn of Massachusetts Institute of Technology adds that many corporate managers find it difficult to measure the contribution of their underlings to a firm's well-being, so they use the number of hours worked as a proxy for output. "Employees know this," she says, and they adjust their behavior accordingly.</p>
<p>"Although the image of the good worker is the one whose life belongs to the company," Bailyn says, "it doesn't fit the facts." She cites both quantitative and qualitative studies that show increased productivity for part-time workers: they make better use of the time they have, and they are less likely to succumb to fatigue in stressful jobs. Companies that employ more workers for less time also gain from the resulting redundancy, she asserts. "The extra people can cover the contingencies that you know are going to happen, such as when crises take people away from the workplace." Positive experiences with reduced hours have begun to change the more-is-better culture at some companies, Schor reports.</p>
<p>Larger firms, in particular, appear to be more willing to experiment with flexible working arrangements...</p>
<p>It may take even more than changes in the financial and cultural structures of employment for workers successfully to trade increased productivity and money for leisure time, Schor contends. She says the U.S. market for goods has become skewed by the assumption of full-time, two-career households. Automobile makers no longer manufacture cheap models, and developers do not build the tiny bungalows that served the first postwar generation of home buyers. Not even the humblest household object is made without a microprocessor. As Schor notes, the situation is a curious inversion of the "appropriate technology" vision that designers have had for developing countries: U.S. goods are appropriate only for high incomes and long hours.</p>`;

async function run() {
    console.log('Seeding Test 3...');
    const exams = [
        { code: 'CAMBRIDGE-1-T3-R1', title: 'Cambridge IELTS 1 - Test 3 - Reading Passage 1' },
        { code: 'CAMBRIDGE-1-T3-R2', title: 'Cambridge IELTS 1 - Test 3 - Reading Passage 2' },
        { code: 'CAMBRIDGE-1-T3-R3', title: 'Cambridge IELTS 1 - Test 3 - Reading Passage 3' },
        { code: 'CAMBRIDGE-1-T3-L1', title: 'Cambridge IELTS 1 - Test 3 - Listening Section 1' },
        { code: 'CAMBRIDGE-1-T3-L2', title: 'Cambridge IELTS 1 - Test 3 - Listening Section 2' },
        { code: 'CAMBRIDGE-1-T3-L3', title: 'Cambridge IELTS 1 - Test 3 - Listening Section 3' },
        { code: 'CAMBRIDGE-1-T3-L4', title: 'Cambridge IELTS 1 - Test 3 - Listening Section 4' },
        { code: 'CAMBRIDGE-1-T3-FULL', title: 'Cambridge IELTS 1 - Test 3 - Full Mock Test' }
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
        { skill: 'reading', title: 'SPOKEN CORPUS COMES TO LIFE', passage_text: PASSAGE_1 },
        { skill: 'reading', title: 'Moles happy as homes go underground', passage_text: PASSAGE_2 },
        { skill: 'reading', title: 'A Workaholic Economy', passage_text: PASSAGE_3 },
        { skill: 'listening', title: 'Listening Section 1', audio_url: 'https://kigoxvdlcyjxfpetuxiu.supabase.co/storage/v1/object/public/listening-audio/cambridge-1/Test%203%20-%20Section%201.mp3' },
        { skill: 'listening', title: 'Listening Section 2', audio_url: 'https://kigoxvdlcyjxfpetuxiu.supabase.co/storage/v1/object/public/listening-audio/cambridge-1/Test%203%20-%20Section%202.mp3' },
        { skill: 'listening', title: 'Listening Section 3', audio_url: 'https://kigoxvdlcyjxfpetuxiu.supabase.co/storage/v1/object/public/listening-audio/cambridge-1/Test%203%20-%20Section%203.mp3' },
        { skill: 'listening', title: 'Listening Section 4', audio_url: 'https://kigoxvdlcyjxfpetuxiu.supabase.co/storage/v1/object/public/listening-audio/cambridge-1/Test%203%20-%20Section%204.mp3' }
    ];

    const insertedPassages = [];
    for (const p of passagesData) {
        const { data } = await supabase.from('passages').insert(p).select().single();
        insertedPassages.push(data);
    }

    const links = [
        { exam: 'CAMBRIDGE-1-T3-R1', passage: 0, order: 1 },
        { exam: 'CAMBRIDGE-1-T3-R2', passage: 1, order: 1 },
        { exam: 'CAMBRIDGE-1-T3-R3', passage: 2, order: 1 },
        { exam: 'CAMBRIDGE-1-T3-L1', passage: 3, order: 1 },
        { exam: 'CAMBRIDGE-1-T3-L2', passage: 4, order: 1 },
        { exam: 'CAMBRIDGE-1-T3-L3', passage: 5, order: 1 },
        { exam: 'CAMBRIDGE-1-T3-L4', passage: 6, order: 1 },
        { exam: 'CAMBRIDGE-1-T3-FULL', passage: 0, order: 1 },
        { exam: 'CAMBRIDGE-1-T3-FULL', passage: 1, order: 2 },
        { exam: 'CAMBRIDGE-1-T3-FULL', passage: 2, order: 3 },
        { exam: 'CAMBRIDGE-1-T3-FULL', passage: 3, order: 4 },
        { exam: 'CAMBRIDGE-1-T3-FULL', passage: 4, order: 5 },
        { exam: 'CAMBRIDGE-1-T3-FULL', passage: 5, order: 6 },
        { exam: 'CAMBRIDGE-1-T3-FULL', passage: 6, order: 7 }
    ];
    for (const link of links) {
        await supabase.from('exam_passages').insert({
            exam_id: insertedExams[link.exam],
            passage_id: insertedPassages[link.passage].id,
            order_index: link.order
        });
    }

    const qs = [];
    
    // R1: 12 qs
    qs.push({
        passage_id: insertedPassages[0].id, order_index: 1, question_number: 1, type: 'matching_headings',
        group_instruction: 'Questions 1-6: Choose the most suitable heading for each paragraph.',
        content: {
            headings: [{key:'i',text:'Grammar is corrected'},{key:'ii',text:'New method of research'},{key:'iii',text:'Technology learns from dictionaries'},{key:'iv',text:'Non-verbal content'},{key:'v',text:'The first study of spoken language'},{key:'vi',text:'Traditional lexicographical methods'},{key:'vii',text:'Written English tells the truth'},{key:'viii',text:'New phrases enter dictionary'},{key:'ix',text:'A cooperative research project'},{key:'x',text:'Accurate word frequency counts'},{key:'xi',text:'Alternative expressions provided'}],
            items: [{paragraph:'A',correct_answer:'vi'},{paragraph:'B',correct_answer:'ii'},{paragraph:'D',correct_answer:'x'},{paragraph:'E',correct_answer:'viii'},{paragraph:'F',correct_answer:'iv'},{paragraph:'G',correct_answer:'ix'}]
        }, points: 6
    });
    qs.push({
        passage_id: insertedPassages[0].id, order_index: 2, question_number: 7, type: 'diagram_label_completion',
        group_instruction: 'Questions 7-11: Complete the labels on the diagram.',
        content: {
            image_url: 'https://kigoxvdlcyjxfpetuxiu.supabase.co/storage/v1/object/public/listening-audio/cambridge-1/test3_r1_diagram.png',
            labels: [{label_id: "7", correct_answers: ["existing"]}, {label_id: "8", correct_answers: ["related phrases", "phrases"]}, {label_id: "9", correct_answers: ["meanings", "forms"]}, {label_id: "10", correct_answers: ["spoken", "real", "oral"]}, {label_id: "11", correct_answers: ["noise", "pauses", "noises and pauses"]}]
        }, points: 5
    });
    qs.push({ passage_id: insertedPassages[0].id, order_index: 3, question_number: 12, type: 'multiple_choice', group_instruction: 'Question 12', content: { question: 'Why was this article written?', options: [{key:'A',text:'To give an example of a current dictionary.'},{key:'B',text:'To announce a new approach to dictionary writing.'},{key:'C',text:'To show how dictionaries have progressed over the years.'},{key:'D',text:'To compare the content of different dictionaries'}], correct_answer: 'B', explanation: '' }, points: 1 });

    // R2: 14 qs
    qs.push({
        passage_id: insertedPassages[1].id, order_index: 1, question_number: 13, type: 'matching_headings',
        group_instruction: 'Questions 13-20: Choose the most suitable heading for each paragraph.',
        content: {
            headings: [{key:'i',text:'A designer describes his houses'},{key:'ii',text:'Most people prefer conventional housing'},{key:'iii',text:'Simulating a natural environment'},{key:'iv',text:'How an underground family home developed'},{key:'v',text:'Demands on space and energy are reduced'},{key:'vi',text:'The plans for future homes'},{key:'vii',text:'Worldwide examples of underground living accommodation'},{key:'viii',text:'Some buildings do not require natural light'},{key:'ix',text:'Developing underground services around the world'},{key:'x',text:'Underground living improves health'},{key:'xi',text:'Homes sold before completion'},{key:'xii',text:'An underground home is discovered'}],
            items: [{paragraph:'B',correct_answer:'xi'},{paragraph:'C',correct_answer:'ix'},{paragraph:'D',correct_answer:'viii'},{paragraph:'E',correct_answer:'v'},{paragraph:'F',correct_answer:'i'},{paragraph:'G',correct_answer:'vii'},{paragraph:'H',correct_answer:'iii'},{paragraph:'I',correct_answer:'iv'}]
        }, points: 8
    });
    qs.push({
        passage_id: insertedPassages[1].id, order_index: 2, question_number: 21, type: 'sentence_completion',
        group_instruction: 'Questions 21-26: Complete the sentences below with words taken from the reading passage.',
        content: {
            text_template: '21. Many developers prefer mass-produced houses because they (21) [blank_1]\n22. The Dutch development was welcomed by (22) [blank_2]\n23. Hurkmans\' houses are built into (23) [blank_3]\n24. The Ivrea centre was developed for (24) [blank_4]\n25. Japanese scientists are helping people (25) [blank_5] underground life.\n26. Frank Siegmund\'s first underground room was used for (26) [blank_6]',
            word_limit: 'NO MORE THAN THREE WORDS',
            blanks: [{blank_id: 1, correct_answers: ['sell quickly', 'sell more quickly']},{blank_id: 2, correct_answers: ['South Limberg planners', 'planners']},{blank_id: 3, correct_answers: ['road embankments', 'noise embankments']},{blank_id: 4, correct_answers: ['Olivetti employees']},{blank_id: 5, correct_answers: ['adapt to']},{blank_id: 6, correct_answers: ['his bakery business', 'a cool room']}]
        }, points: 6
    });

    // R3: 12 qs
    const yn27 = [{q:27,s:'Today, employees are facing a reduction in working hours.',a:'NO'},{q:28,s:'Social planners have been consulted about US employment figures.',a:'NOT GIVEN'},{q:29,s:'Salaries have not risen significantly since the 1970s.',a:'YES'},{q:30,s:'The economic recovery created more jobs.',a:'NO'},{q:31,s:'Bailyn\'s research shows that part-time employees work more efficiently.',a:'YES'},{q:32,s:'Increased leisure time would benefit two-career households.',a:'NOT GIVEN'}];
    yn27.forEach((q, i) => qs.push({ passage_id: insertedPassages[2].id, order_index: i+1, question_number: q.q, type: 'yes_no_not_given', group_instruction: 'Questions 27-32: YES, NO, NOT GIVEN', content: { statement: q.s, correct_answer: q.a, explanation: '' }, points: 1 }));
    
    qs.push({ passage_id: insertedPassages[2].id, order_index: 7, question_number: 33, type: 'multiple_choice', group_instruction: 'Questions 33-34: Choose A-D', content: { question: 'Bailyn argues that it is better for a company to employ more workers because', options: [{key:'A',text:'it is easy to make excess staff redundant.'},{key:'B',text:'crises occur if you are under-staffed.'},{key:'C',text:'people are available to substitute for absent staff.'},{key:'D',text:'they can project a positive image at work.'}], correct_answer: 'C', explanation: '' }, points: 1 });
    qs.push({ passage_id: insertedPassages[2].id, order_index: 8, question_number: 34, type: 'multiple_choice', group_instruction: 'Questions 33-34: Choose A-D', content: { question: 'Schor thinks it will be difficult for workers in the US to reduce their working hours because', options: [{key:'A',text:'they would not be able to afford cars or homes.'},{key:'B',text:'employers are offering high incomes for long hours.'},{key:'C',text:'the future is dependent on technological advances.'},{key:'D',text:'they do not wish to return to the humble post-war era.'}], correct_answer: 'A', explanation: '' }, points: 1 });

    qs.push({
        passage_id: insertedPassages[2].id, order_index: 9, question_number: 35, type: 'note_completion',
        group_instruction: 'Questions 35-38: Which FOUR of the following factors are mentioned?',
        content: {
            text_template: 'List of Factors\nA Books are available to help employees cope with stress.\nB Extra work is offered to existing employees.\nC Increased production has led to joblessness.\nD Benefits and hours spent on the job are not linked.\nE Overworked employees require longer to do their work.\nF Longer hours indicate greater commitment to the firm.\nG Managers estimate staff productivity in terms of hours worked.\nH Employees value a career more than a family.\n\n35. [blank_1]\n36. [blank_2]\n37. [blank_3]\n38. [blank_4]',
            word_limit: 'ONE LETTER',
            blanks: [{blank_id: 1, correct_answers: ['B', 'b', 'D', 'd', 'F', 'f', 'G', 'g']},{blank_id: 2, correct_answers: ['B', 'b', 'D', 'd', 'F', 'f', 'G', 'g']},{blank_id: 3, correct_answers: ['B', 'b', 'D', 'd', 'F', 'f', 'G', 'g']},{blank_id: 4, correct_answers: ['B', 'b', 'D', 'd', 'F', 'f', 'G', 'g']}]
        }, points: 4
    });

    // L1: 12 qs
    const l1mc = [
        {q:1, text:'What are the parking regulations on campus?', options:[{k:'A',t:'undergraduate parking allowed'},{k:'B',t:'postgraduate parking allowed'},{k:'C',t:'staff parking only allowed'},{k:'D',t:'no student parking allowed'}], a:'B'},
        {q:2, text:'The administration office is in', options:[{k:'A',t:'Block B.'},{k:'B',t:'Block D.'},{k:'C',t:'Block E.'},{k:'D',t:'Block G.'}], a:'D'},
        {q:3, text:'If you do not have a parking sticker, the following action will be taken:', options:[{k:'A',t:'wheel clamp your car.'},{k:'B',t:'fine only.'},{k:'C',t:'tow away your car and fine.'},{k:'D',t:'tow away your car only.'}], a:'C'},
        {q:4, text:'Which picture shows the correct location of the Administration office?', options:[{k:'A',t:'Picture A'},{k:'B',t:'Picture B'},{k:'C',t:'Picture C'},{k:'D',t:'Picture D'}], a:'A'}
    ];
    l1mc.forEach((q, i) => qs.push({ passage_id: insertedPassages[3].id, order_index: i+1, question_number: q.q, type: 'multiple_choice', group_instruction: 'Questions 1-4: Circle the appropriate letter', content: { question: q.text, options: q.options.map(o=>({key:o.k,text:o.t})), correct_answer: q.a, explanation: '' }, points: 1 }));
    qs.push({
        passage_id: insertedPassages[3].id, order_index: 5, question_number: 5, type: 'form_completion',
        group_instruction: 'Questions 5-10: Complete the application form using NO MORE THAN THREE WORDS.',
        content: {
            text_template: 'Application for parking sticker\nName (5) [blank_1]\nAddress (6) Flat 13 [blank_2]\nSuburb (7) [blank_3]\nFaculty (8) [blank_4]\nRegistration number (9) [blank_5]\nMake of car (10) [blank_6]',
            word_limit: 'NO MORE THAN THREE WORDS',
            blanks: [{blank_id: 1, correct_answers: ['Richard Lee']},{blank_id: 2, correct_answers: ['30 Enmore Road']},{blank_id: 3, correct_answers: ['Newport']},{blank_id: 4, correct_answers: ['Architecture']},{blank_id: 5, correct_answers: ['LJX 058K']},{blank_id: 6, correct_answers: ['Ford']}]
        }, points: 6
    });
    qs.push({ passage_id: insertedPassages[3].id, order_index: 6, question_number: 11, type: 'multiple_choice', group_instruction: 'Questions 11-12', content: { question: 'Cashier\'s office opens at', options: [{key:'A',text:'12.15'},{key:'B',text:'2.00'},{key:'C',text:'2.15'},{key:'D',text:'4.30'}], correct_answer: 'C', explanation: '' }, points: 1 });
    qs.push({ passage_id: insertedPassages[3].id, order_index: 7, question_number: 12, type: 'multiple_choice', group_instruction: 'Questions 11-12', content: { question: 'Where must the sticker be displayed?', options: [{key:'A',text:'front window'},{key:'B',text:'back window'},{key:'C',text:'side window'},{key:'D',text:'front windscreen'}], correct_answer: 'D', explanation: '' }, points: 1 });

    // L2: 11 qs
    qs.push({
        passage_id: insertedPassages[4].id, order_index: 1, question_number: 13, type: 'note_completion',
        group_instruction: 'Questions 13-23: Complete the notes.',
        content: {
            text_template: 'Date the museum was opened (13) [blank_1]\nThe museum consists of a building and (14) [blank_2]\nThe Education Centre is signposted by (15) [blank_3]\nIf you lose your friends, meet at the (16) [blank_4]\nWarning about The Vampire (17) [blank_5]\nHow often are the tours of The Vampire? (18) [blank_6]\nPerson featured in today\'s video (19) [blank_7]\nThe Leisure Gallery shows how Australian culture is influenced by (20) [blank_8]\nThe Picture Gallery contains pictures by (21) [blank_9]\nCost of family membership of the museum (22) [blank_10]\n"Passengers and the Sea" includes a collection of (23) [blank_11]',
            word_limit: 'NO MORE THAN THREE WORDS',
            blanks: [{blank_id: 1, correct_answers: ['November 1991']},{blank_id: 2, correct_answers: ['historic ships', 'ships']},{blank_id: 3, correct_answers: ['green arrows']},{blank_id: 4, correct_answers: ['information desk']},{blank_id: 5, correct_answers: ['stairs to climb', 'lots of stairs']},{blank_id: 6, correct_answers: ['every hour']},{blank_id: 7, correct_answers: ['Captain Cook']},{blank_id: 8, correct_answers: ['the sea']},{blank_id: 9, correct_answers: ['Australian artists', 'Australian painters']},{blank_id: 10, correct_answers: ['$70']},{blank_id: 11, correct_answers: ['souvenirs']}]
        }, points: 11
    });

    // L3: 9 qs
    const l3mc2 = [
        {q:24, text:'Mark is going to talk briefly about', options:[{k:'A',t:'marketing new products.'},{k:'B',t:'pricing strategies.'},{k:'C',t:'managing large companies.'},{k:'D',t:'setting sales targets.'}], a:'B'},
        {q:25, text:'According to Susan, air fares are lowest when they', options:[{k:'A',t:'include weekend travel.'},{k:'B',t:'are booked well in advance.'},{k:'C',t:'are non-refundable.'},{k:'D',t:'are for business travel only.'}], a:'C'},
        {q:26, text:'Mark thinks revenue management is', options:[{k:'A',t:'interesting.'},{k:'B',t:'complicated.'},{k:'C',t:'time-consuming.'},{k:'D',t:'reasonable.'}], a:'D'},
        {q:27, text:'The airline companies want to', options:[{k:'A',t:'increase profits.'},{k:'B',t:'benefit the passenger.'},{k:'C',t:'sell cheap seats.'},{k:'D',t:'improve the service.'}], a:'A'}
    ];
    l3mc2.forEach((q, i) => qs.push({ passage_id: insertedPassages[5].id, order_index: i+1, question_number: q.q, type: 'multiple_choice', group_instruction: 'Questions 24-27: Click the correct answer', content: { question: q.text, options: q.options.map(o=>({key:o.k,text:o.t})), correct_answer: q.a, explanation: '' }, points: 1 }));
    qs.push({
        passage_id: insertedPassages[5].id, order_index: 5, question_number: 28, type: 'note_completion',
        group_instruction: 'Questions 28-32: Complete the notes.',
        content: {
            text_template: 'Two reasons for the new approach to pricing are: (28) [blank_1] and (29) [blank_2].\nIn future people will be able to book airline tickets (30) [blank_3].\nAlso being marketed in this way are (31) [blank_4] and (32) [blank_5].',
            word_limit: 'NO MORE THAN THREE WORDS',
            blanks: [{blank_id: 1, correct_answers: ['law has changed', 'law changes', 'changes in law']},{blank_id: 2, correct_answers: ['computer programs', 'powerful computer programs']},{blank_id: 3, correct_answers: ['from home', 'from home computer']},{blank_id: 4, correct_answers: ['hotels', 'hotel beds', 'hotel rooms']},{blank_id: 5, correct_answers: ['hire cars']}]
        }, points: 5
    });

    // L4: 10 qs
    qs.push({
        passage_id: insertedPassages[6].id, order_index: 1, question_number: 33, type: 'table_completion',
        group_instruction: 'Questions 33-37: Complete the table.',
        content: {
            text_template: 'SPACE MANAGEMENT\nRESEARCH METHOD | INFORMATION PROVIDED\nQuestionnaires | what customers think about (33) [blank_1]\n(34) [blank_2] | how customers move around supermarket aisles\nEye movement (35) [blank_3] | the most eye-catching areas of the shop\nComputer programs e.g. (36) [blank_4] | the best (37) [blank_5] for an article in the shop',
            word_limit: 'NO MORE THAN THREE WORDS',
            blanks: [{blank_id: 1, correct_answers: ['displays', 'products', 'displays and products']},{blank_id: 2, correct_answers: ['hidden TV cameras', 'TV cameras']},{blank_id: 3, correct_answers: ['recorder', 'recording']},{blank_id: 4, correct_answers: ['Spaceman']},{blank_id: 5, correct_answers: ['position', 'shelf', 'spot', 'place']}]
        }, points: 5
    });
    qs.push({
        passage_id: insertedPassages[6].id, order_index: 2, question_number: 38, type: 'diagram_label_completion',
        group_instruction: 'Questions 38-42: Label the diagram.',
        content: {
            image_url: 'https://kigoxvdlcyjxfpetuxiu.supabase.co/storage/v1/object/public/listening-audio/cambridge-1/test3_l4_aisle.jpg',
            labels: [{label_id: "38", correct_answers: ["walk straight past", "walk right past", "ignore", "pass"]},{label_id: "39", correct_answers: ["at eye level", "near customers' eyes"]},{label_id: "40", correct_answers: ["hotspots"]},{label_id: "41", correct_answers: ["special offers"]},{label_id: "42", correct_answers: ["chocolates"]}]
        }, points: 5
    });

    const { error } = await supabase.from('questions').insert(qs);
    if(error) console.error('Qs Error', error);
    else console.log('Test 3 Seeded successfully.');
}
run();
