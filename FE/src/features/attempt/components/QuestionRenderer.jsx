import React from 'react';
import MultipleChoice from './questionTypes/MultipleChoice';
import TrueFalseNotGiven from './questionTypes/TrueFalseNotGiven';
import SentenceCompletion from './questionTypes/SentenceCompletion';
import MatchingType from './questionTypes/MatchingType';
import DiagramLabelCompletion from './questionTypes/DiagramLabelCompletion';

const typeComponentMap = {
  multiple_choice: MultipleChoice,
  true_false_not_given: TrueFalseNotGiven,
  yes_no_not_given: TrueFalseNotGiven,
  sentence_completion: SentenceCompletion,
  summary_completion: SentenceCompletion,
  note_completion: SentenceCompletion,
  table_completion: SentenceCompletion,
  form_completion: SentenceCompletion,
  short_answer: SentenceCompletion,
  matching_information: MatchingType,
  matching_headings: MatchingType,
  matching_features: MatchingType,
  diagram_label_completion: DiagramLabelCompletion,
};

export default function QuestionRenderer({ question, value, onChange }) {
  const Component = typeComponentMap[question.type];

  if (!Component) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm font-medium text-yellow-800">
          Loại câu hỏi này đang phát triển ({question.type})
        </p>
      </div>
    );
  }

  return <Component question={question} value={value} onChange={onChange} />;
}
