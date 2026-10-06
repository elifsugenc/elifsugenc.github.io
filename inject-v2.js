const fs = require('fs');
const newContent = fs.readFileSync('bajo-snippet-v2.txt', 'utf8');
let html = fs.readFileSync('projects/bajo-la-fresca/index.html', 'utf8');
html = html.replace(/<div class="detail-body">[\s\S]*?<\/article>/, newContent + "\n</article>");
fs.writeFileSync('projects/bajo-la-fresca/index.html', html, 'utf8');
console.log("Injected v2 properly!");
