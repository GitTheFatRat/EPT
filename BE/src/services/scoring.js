export function scoreQuestion(question, userAnswer) {
    if (userAnswer === undefined || userAnswer === null || userAnswer === '') {
        return { isCorrect: false };
    }
    const { type, content } = question;
    try {
        switch (type) {
            case 'multiple_choice':
            case 'true_false_not_given':
            case 'yes_no_not_given':
                if (typeof userAnswer === 'string' && typeof content.correct_answer === 'string') {
                    return { isCorrect: userAnswer.trim().toUpperCase() === content.correct_answer.trim().toUpperCase() };
                }
                return { isCorrect: false };
            case 'matching_headings':
            case 'matching_information':
            case 'matching_features':
                // Expects userAnswer to be an object: { [itemKey/paragraph]: answer }
                // e.g. { "A": "iii", "B": "i" }
                // The question has content.items array: { paragraph: "A", correct_answer: "iii" } or { statement: "...", correct_answer: "C" }
                if (typeof userAnswer !== 'object')
                    return { isCorrect: false };
                // We evaluate each item. Since points are usually per item, we might return an array of correct items, 
                // but for now let's assume the question points is the total of all items, or the question is split. 
                // Wait, standard IELTS modeling usually puts ONE question_number per item!
                // Ah, looking at `question_number`, it's an INT. So each row in `questions` represents ONE question_number!
                // If so, a matching_headings question row only has ONE item?
                // Let's check CLAUDE.md: "The question has content.items...". 
                // Actually, if it's one row per question_number, then `items` shouldn't be an array of multiple questions, OR the question_number is just the start number. 
                // To be safe, if we have an array of items, let's say it's completely correct only if ALL items are correct, OR we just return the count of correct items in `details`.
                // Let's assume if the question has `items`, userAnswer is a dict.
                let correctItems = 0;
                let totalItems = content.items?.length || 1;
                if (content.items) {
                    for (const item of content.items) {
                        const key = item.paragraph || item.statement || item.id;
                        const ans = userAnswer[key];
                        if (ans && typeof ans === 'string' && ans.trim().toUpperCase() === item.correct_answer.trim().toUpperCase()) {
                            correctItems++;
                        }
                    }
                }
                return { isCorrect: correctItems === totalItems, isPartiallyCorrect: correctItems > 0 && correctItems < totalItems, details: { correctItems, totalItems } };
            case 'sentence_completion':
            case 'summary_completion':
            case 'note_completion':
            case 'table_completion':
            case 'form_completion':
                // content.blanks = [{ blank_id: 1, correct_answers: ["A", "B"] }]
                // userAnswer = { "1": "A" }
                if (typeof userAnswer !== 'object')
                    return { isCorrect: false };
                let correctBlanks = 0;
                let totalBlanks = content.blanks?.length || 1;
                if (content.blanks) {
                    for (const blank of content.blanks) {
                        const ans = userAnswer[blank.blank_id];
                        if (ans && typeof ans === 'string') {
                            const match = blank.correct_answers.some((ca) => ca.trim().toLowerCase() === ans.trim().toLowerCase());
                            if (match)
                                correctBlanks++;
                        }
                    }
                }
                return { isCorrect: correctBlanks === totalBlanks, isPartiallyCorrect: correctBlanks > 0 && correctBlanks < totalBlanks, details: { correctBlanks, totalBlanks } };
            case 'diagram_label_completion':
                // content.labels = [{ label_id: "A", correct_answers: ["engine"] }]
                if (typeof userAnswer !== 'object')
                    return { isCorrect: false };
                let correctLabels = 0;
                let totalLabels = content.labels?.length || 1;
                if (content.labels) {
                    for (const label of content.labels) {
                        const ans = userAnswer[label.label_id];
                        if (ans && typeof ans === 'string') {
                            const match = label.correct_answers.some((ca) => ca.trim().toLowerCase() === ans.trim().toLowerCase());
                            if (match)
                                correctLabels++;
                        }
                    }
                }
                return { isCorrect: correctLabels === totalLabels, isPartiallyCorrect: correctLabels > 0 && correctLabels < totalLabels, details: { correctLabels, totalLabels } };
            case 'short_answer':
                // content.correct_answers = ["thatch", "thatched straw"]
                // userAnswer = "thatch"
                if (typeof userAnswer === 'string' && Array.isArray(content.correct_answers)) {
                    const match = content.correct_answers.some((ca) => ca.trim().toLowerCase() === userAnswer.trim().toLowerCase());
                    return { isCorrect: match };
                }
                return { isCorrect: false };
            default:
                return { isCorrect: false };
        }
    }
    catch (e) {
        return { isCorrect: false };
    }
}

