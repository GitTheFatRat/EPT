// MOCK: cần thay bằng API thật sau

export const mockDashboardData = {
  streak: 6,
  examDaysLeft: 14,
  examDate: 'Oct 2, 2026',
  rankGlobal: 6,
  timePracticed: '41h',
  
  // Progress bar percentages (if logic not implementable yet)
  progressOverall: 78,
  progressListening: 83,
  progressReading: 72,

  // This week chart data (mocked heights for tailwind bars)
  thisWeek: [
    { day: 'Mon', reading: 40, listening: 30 },
    { day: 'Tue', reading: 0, listening: 0 },
    { day: 'Wed', reading: 60, listening: 40 },
    { day: 'Thu', reading: 80, listening: 70 },
    { day: 'Fri', reading: 90, listening: 50 },
    { day: 'Sat', reading: 100, listening: 90 },
    { day: 'Sun', reading: 20, listening: 20 }
  ]
};
