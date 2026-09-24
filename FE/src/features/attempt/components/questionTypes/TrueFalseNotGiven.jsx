import React from 'react';

export default function TrueFalseNotGiven({ question, value, onChange }) {
  const { content, type } = question;
  
  const isYesNo = type === 'yes_no_not_given';
  const options = isYesNo 
    ? ['YES', 'NO', 'NOT GIVEN'] 
    : ['TRUE', 'FALSE', 'NOT GIVEN'];
  
  return (
    <div className="space-y-4">
      <p className="text-gray-900 font-medium leading-relaxed">{content.statement}</p>
      <div className="flex space-x-3">
        {options.map(opt => (
          <label key={opt} className={`flex-1 flex items-center justify-center p-3 rounded-md border cursor-pointer transition-colors ${value === opt ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 hover:border-gray-400 text-gray-700'}`}>
            <input
              type="radio"
              name={`q-${question.id}`}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
              className="hidden"
            />
            <span className="font-semibold text-sm">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
