import React from 'react';
import ExamListLayout from './ExamListLayout';

export default function ReadingListPage() {
  return (
    <ExamListLayout 
      skillCategory="reading"
      title="Reading"
      subtitle="Academic reading passages from Cambridge exam sets."
    />
  );
}
