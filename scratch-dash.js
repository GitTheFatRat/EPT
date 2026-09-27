const fs = require('fs');
let text = fs.readFileSync('FE/src/features/dashboard/DashboardPage.jsx', 'utf8');
text = text.replace(
  "const username = user?.username || 'Student';",
  "const displayName = user?.fullName || user?.username || 'Student';"
);
text = text.replace("<Sidebar username={username}", "<Sidebar username={displayName}");
text = text.replace("{getGreeting()}, {username}", "{getGreeting()}, {displayName}");
fs.writeFileSync('FE/src/features/dashboard/DashboardPage.jsx', text);
