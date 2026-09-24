export function stripAnswersFromContent(content) {
    if (Array.isArray(content)) {
        return content.map(item => stripAnswersFromContent(item));
    }
    if (content !== null && typeof content === 'object') {
        const stripped = {};
        for (const key in content) {
            if (key === 'correct_answer' || key === 'correct_answers' || key === 'explanation') {
                continue;
            }
            stripped[key] = stripAnswersFromContent(content[key]);
        }
        return stripped;
    }
    return content;
}

