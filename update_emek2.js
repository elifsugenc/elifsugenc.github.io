const fs = require('fs');
const filePath = 'projects/emek-museum/index.html';
let content = fs.readFileSync(filePath, 'utf8');

const target = '</h1></div><div class="detail-body">';
const insertStr = '</h1></div><p class="detail-body detail-pending" style="margin-bottom: 2em; display: block;" data-en="-ongoing project-" data-tr="-devam eden proje-">-ongoing project-</p><div class="detail-body">';

content = content.replace(target, insertStr);

fs.writeFileSync(filePath, content, 'utf8');
console.log('done');
