import React from 'react';

export default function SentenceCompletion({ question, value, onChange }) {
  const { content, type } = question;
  
  const isShortAnswer = type === 'short_answer';

  // value is expected to be an object for multi-blank, or string for short answer
  // but let's standardise on object { [blankId]: string } for template, and just string for short_answer.

  const handleTemplateChange = (blankId, text) => {
    const current = typeof value === 'object' && value !== null ? value : {};
    onChange({ ...current, [blankId]: text });
  };

  const renderTemplate = () => {
    if (!content.text_template) return null;
    
    // Split by {{n}}
    const parts = content.text_template.split(/({{\d+}})/g);
    
    return (
      <div className="leading-loose text-gray-800">
        {parts.map((part, i) => {
          const match = part.match(/^{{(\d+)}}$/);
          if (match) {
            const blankId = match[1];
            const val = (value && typeof value === 'object') ? (value[blankId] || '') : '';
            return (
              <input
                key={i}
                type="text"
                value={val}
                onChange={(e) => handleTemplateChange(blankId, e.target.value)}
                className="mx-1 border-b-2 border-gray-300 focus:border-gray-900 outline-none w-32 px-1 text-center font-medium bg-transparent"
              />
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {content.word_limit && (
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
          {content.word_limit}
        </p>
      )}
      
      {isShortAnswer ? (
        <div className="space-y-3">
          <p className="text-gray-900 font-medium">{content.question}</p>
          <input
            type="text"
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-1 focus:ring-gray-900 outline-none"
            placeholder="Your answer..."
          />
        </div>
      ) : (
        renderTemplate()
      )}
    </div>
  );
}
