const fs = require('fs');
const path = require('path');

const contractPath = 'md/03_API_CONTRACT.md';
const contract = fs.readFileSync(contractPath, 'utf8');

// Find all camelCase keys in json blocks or text
const camelCaseRegex = /\b([a-z]+([A-Z][a-z0-9]*)+)\b/g;
const matches = [...contract.matchAll(camelCaseRegex)];
const camelKeys = [...new Set(matches.map(m => m[1]))];

const toSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
const mappings = camelKeys.map(k => ({ camel: k, snake: toSnakeCase(k) }));

function scanDir(dir) {
    let results = [];
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            results = results.concat(scanDir(fullPath));
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            for (const { camel, snake } of mappings) {
                // If the snake case is used in the file, report it
                // We should ensure it's a word boundary
                const regex = new RegExp(`\\b${snake}\\b`, 'g');
                if (regex.test(content)) {
                    results.push(`Found ${snake} (from ${camel}) in ${fullPath}`);
                }
            }
        }
    }
    return results;
}

const warnings = scanDir('FE/src/features');
console.log(warnings.join('\n') || 'No suspicious snake_case fields found!');
