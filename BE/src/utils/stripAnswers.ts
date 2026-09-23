export function stripAnswersFromContent(content: unknown): unknown {
  if (Array.isArray(content)) {
    return content.map(item => stripAnswersFromContent(item));
  }
  
  if (content !== null && typeof content === 'object') {
    const stripped: Record<string, unknown> = {};
    for (const key in content) {
      if (key === 'correct_answer' || key === 'correct_answers' || key === 'explanation') {
        continue;
      }
      stripped[key] = stripAnswersFromContent((content as Record<string, unknown>)[key]);
    }
    return stripped;
  }
  
  return content;
}
