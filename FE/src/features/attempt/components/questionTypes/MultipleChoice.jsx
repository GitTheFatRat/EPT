import React from 'react';

export default function MultipleChoice({ question, value, onChange }) {
  const { content } = question;
  
  return (
    <div className="space-y-4">
      {content.question && (
        <p className="text-gray-900 font-medium">{content.question}</p>
      )}
      <div className="space-y-2">
        {(content.options || []).map((opt) => (
          <label key={opt.key} className="flex items-start space-x-3 cursor-pointer p-3 rounded-md border border-gray-100 hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name={`q-${question.id}`}
              value={opt.key}
              checked={value === opt.key}
              onChange={() => onChange(opt.key)}
              className="mt-0.5 text-black focus:ring-black"
            />
            <div className="flex-1">
              <span className="font-semibold text-gray-900 mr-2">{opt.key}.</span>
              <span className="text-gray-700">{opt.text}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
