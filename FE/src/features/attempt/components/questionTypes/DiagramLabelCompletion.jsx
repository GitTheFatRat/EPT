import React from 'react';

export default function DiagramLabelCompletion({ question, value, onChange }) {
  const { content } = question;
  
  const handleChange = (labelId, text) => {
    const current = typeof value === 'object' && value !== null ? value : {};
    onChange({ ...current, [labelId]: text });
  };

  return (
    <div className="space-y-6">
      {content.image_url && (
        <div className="flex justify-center mb-6">
          <img src={content.image_url} alt="Diagram to label" className="max-w-full h-auto border border-gray-200 rounded-md shadow-sm" />
        </div>
      )}
      
      <div className="space-y-4">
        <p className="text-sm font-medium text-gray-700">Fill in the labels:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(content.labels || []).map((labelObj, idx) => {
            const labelId = labelObj.label_id || String(idx + 1);
            const val = (value && typeof value === 'object') ? (value[labelId] || '') : '';
            return (
              <div key={labelId} className="flex items-center space-x-3">
                <span className="font-bold text-gray-800 w-8 text-right">{labelId}.</span>
                <input
                  type="text"
                  value={val}
                  onChange={(e) => handleChange(labelId, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-gray-900 outline-none"
                  placeholder={`Label ${labelId}...`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
