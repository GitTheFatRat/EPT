import fs from 'fs';

const filePath = 'C:\\Users\\Administrator\\Desktop\\EPT\\BE\\src\\services\\exam.service.js';
let code = fs.readFileSync(filePath, 'utf8');

code = code.replace(/select\('\*',\s*\{\s*count:\s*'exact'\s*\}\)/, "select('*, passages(id, skill, title)', { count: 'exact' })");
code = code.replace(/updatedAt:\s*item\.updated_at,/, 'updatedAt: item.updated_at,\n        passages: item.passages,');

fs.writeFileSync(filePath, code);
console.log('Fixed exam.service.js');
