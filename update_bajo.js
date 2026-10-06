const fs = require('fs');
let html = fs.readFileSync('projects/bajo-la-fresca/index.html', 'utf8');
const newContent = fs.readFileSync('new-content.html', 'utf8');

html = html.replace(/<div class="detail-body">[\s\S]*?<\/div>/, newContent);
html = html.replace(/<p class="detail-body detail-pending"[\s\S]*?<\/p>/, ""); // Remove the 'More from this project soon' placeholder

fs.writeFileSync('projects/bajo-la-fresca/index.html', html, 'utf8');
console.log("Updated bajo-la-fresca");
