const fs = require('fs');

const filesToUpdate = [
  'FE/src/features/exam/ExamListLayout.jsx',
  'FE/src/features/leaderboard/LeaderboardPage.jsx',
  'FE/src/features/profile/ProfilePage.jsx',
  'FE/src/features/result/ResultPage.jsx'
];

for (const file of filesToUpdate) {
  let text = fs.readFileSync(file, 'utf8');
  if (file.includes('ExamListLayout.jsx') || file.includes('LeaderboardPage.jsx')) {
    text = text.replace("const username = user?.username || 'Student';", "const username = user?.fullName || user?.username || 'Student';");
  } else if (file.includes('ProfilePage.jsx') || file.includes('ResultPage.jsx')) {
    text = text.replace(/username={user\?\.username}/g, "username={user?.fullName || user?.username}");
  }
  fs.writeFileSync(file, text);
}
