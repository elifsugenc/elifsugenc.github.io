const fs = require('fs');
let html = fs.readFileSync('projects/index.html', 'utf8');

const oldStr = '<span>Why trace matters<span class="q-mark">?</span></span>';
const newStr = '<span data-en="What remains of the movements we forget<span class=\'q-mark\'>?</span>" data-tr="Unuttuğumuz hareketlerden geriye ne kalır<span class=\'q-mark\'>?</span>">What remains of the movements we forget<span class="q-mark">?</span></span>';

html = html.replace(oldStr, newStr);

fs.writeFileSync('projects/index.html', html, 'utf8');
console.log("Done");
