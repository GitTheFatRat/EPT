import React from 'react';

/**
 * Handles matching_information, matching_headings, and matching_features.
 * Data shapes:
 *   matching_headings:    { items: [{paragraph, correct_answer}], headings: [{key, text}] }
 *   matching_features:    { items: [{statement, correct_answer}], options: [{key, text}], prompt }
 *   matching_information: { items: [{statement, correct_answer}], options: [{key, text}], prompt }
 *
 * User answer stored as object: { "itemIndex": "selectedKey", ... }  e.g. { "0": "A", "1": "C" }
 */
export default function MatchingType({ question, value, onChange }) {
  const { content, type } = question;
  const items = content?.items || [];

  const isHeadings = type === 'matching_headings';
  const choices = isHeadings ? (content?.headings || []) : (content?.options || []);

  const currentAnswers = typeof value === 'object' && value !== null ? value : {};

  const handleSelect = (itemIndex, selectedKey) => {
    const updated = { ...currentAnswers, [String(itemIndex)]: selectedKey };
    onChange(updated);
  };

  return (
    <div className="space-y-5">
      {content?.prompt && (
        <p className="text-gray-700 text-sm font-medium">{content.prompt}</p>
      )}

      {/* Options legend */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
          {isHeadings ? 'List of Headings' : 'Options'}
        </p>
        <div className="space-y-1">
          {choices.map(c => (
            <div key={c.key} className="flex items-start text-sm">
              <span className="font-bold text-gray-700 mr-2 shrink-0 w-6">{c.key}.</span>
              <span className="text-gray-600">{c.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Items to match */}
      <div className="space-y-4">
        {items.map((item, idx) => {
          const label = isHeadings
            ? `Paragraph ${item.paragraph}`
            : item.statement;
          const selectedValue = currentAnswers[String(idx)] || '';

          return (
            <div key={idx} className="flex items-start gap-3">
              <div className="flex-1 text-sm text-gray-800 leading-relaxed pt-2">
                {label}
              </div>
              <select
                value={selectedValue}
                onChange={(e) => handleSelect(idx, e.target.value)}
                className="w-20 shrink-0 px-2 py-2 border border-gray-300 rounded-md text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">--</option>
                {choices.map(c => (
                  <option key={c.key} value={c.key}>{c.key}</option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}
