const fs = require('fs');
let text = fs.readFileSync('BE/src/services/auth.service.js', 'utf8');

text = text.replace(
  'username: dto.username,\n        password_hash: passwordHash,',
  'username: dto.username,\n        full_name: dto.fullName,\n        password_hash: passwordHash,'
);

text = text.replace(
  ".select('id, username, email')",
  ".select('id, username, email, full_name')"
);

text = text.replace(
  'id: user.id,\n            username: user.username,\n            email: user.email,',
  'id: user.id,\n            username: user.username,\n            fullName: user.full_name,\n            email: user.email,'
);

fs.writeFileSync('BE/src/services/auth.service.js', text);
