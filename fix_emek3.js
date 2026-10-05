const fs = require('fs');
const filePath = 'projects/emek-museum/index.html';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace('<div class="detail-heading" style="margin-bottom: 40px; min-height: auto;">', '<div class="detail-heading" style="margin-bottom: 10px; min-height: auto;">');

fs.writeFileSync(filePath, content, 'utf8');
console.log('done');
