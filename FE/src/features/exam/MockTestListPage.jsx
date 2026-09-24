import React from 'react';
import ExamListLayout from './ExamListLayout';

export default function MockTestListPage() {
  return (
    <ExamListLayout 
      skillCategory="mock"
      title="Mock Test"
      subtitle="Full-length timed exams — all 4 sections in one sitting."
    />
  );
}
