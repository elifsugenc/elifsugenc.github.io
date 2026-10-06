const fs = require('fs');
let html = fs.readFileSync('projects/bajo-la-fresca/index.html', 'utf8');
html = html.replace('\n</div>', '</div>'); // wait, let me just find literal "\n"
html = html.replace(/\\n/g, ""); // replace literal \n
fs.writeFileSync('projects/bajo-la-fresca/index.html', html, 'utf8');
console.log("Fixed literal backslash-n");

