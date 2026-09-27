const fs = require('fs');
let text = fs.readFileSync('FE/src/features/profile/ProfilePage.jsx', 'utf8');

text = text.replace(
  "{user?.username?.substring(0, 2).toUpperCase()}",
  "{(user?.fullName || user?.username)?.substring(0, 2).toUpperCase()}"
);

fs.writeFileSync('FE/src/features/profile/ProfilePage.jsx', text);
