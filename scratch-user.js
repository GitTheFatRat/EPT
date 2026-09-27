const fs = require('fs');
let text = fs.readFileSync('BE/src/services/user.service.js', 'utf8');

text = text.replace(
  ".select('id, username, email, role, avatar_url, banner_url, description, target_band, study_type')",
  ".select('id, username, email, full_name, role, avatar_url, banner_url, description, target_band, study_type')"
);
text = text.replace(
  ".select('id, username, email, role, avatar_url, banner_url, description, target_band, study_type')",
  ".select('id, username, email, full_name, role, avatar_url, banner_url, description, target_band, study_type')"
);

text = text.replace(/username: data\.username,\n        email: data\.email,/g, 'username: data.username,\n        fullName: data.full_name,\n        email: data.email,');

fs.writeFileSync('BE/src/services/user.service.js', text);
