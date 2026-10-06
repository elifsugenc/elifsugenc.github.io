const fs = require('fs');
let html = fs.readFileSync('projects/traces-together/index.html', 'utf8');
html = html.replace('</div>\\n        <div style="display: flex; flex-direction: column; gap: 30px; margin-top: 40px;', '</div>\n        <div style="display: flex; flex-direction: column; gap: 30px; margin-top: 40px;');
fs.writeFileSync('projects/traces-together/index.html', html, 'utf8');
console.log("Fixed literal backslash-n");
