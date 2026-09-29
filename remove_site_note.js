const fs = require('fs');

const file = 'index.html';
let content = fs.readFileSync(file, 'utf8');

const regex = /<p class="site-note"[^>]*>.*?<\/p>/g;
content = content.replace(regex, '');

fs.writeFileSync(file, content, 'utf8');
