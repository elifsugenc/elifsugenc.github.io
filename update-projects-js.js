const fs = require('fs');
let code = fs.readFileSync('assets/projects.js', 'utf8');

code = code.replace('Why trace matters<span class="q-mark">?</span>', 'What remains of the movements we forget<span class="q-mark">?</span>');

fs.writeFileSync('assets/projects.js', code, 'utf8');
console.log("Updated projects.js string replace");
