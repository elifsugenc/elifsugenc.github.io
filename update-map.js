const fs = require('fs');
let html = fs.readFileSync('projects/bajo-la-fresca/index.html', 'utf8');
html = html.replace(/<span>Patio San Basilio 44<br>Córdoba, Spain<\/span>/, "<span>Patio San Basilio 44<br>Córdoba, Spain<br><a href=\"https://maps.app.goo.gl/e17ZMPvRNaurZm6VA\" target=\"_blank\" style=\"display: inline-block; margin-top: 8px; color: var(--primary); text-decoration: underline; font-weight: 500;\" data-en=\"Map / Installation Sites ↗\" data-tr=\"Harita / Enstalasyon Alanları ↗\">Map / Installation Sites ↗</a></span>");
fs.writeFileSync('projects/bajo-la-fresca/index.html', html, 'utf8');
console.log("Replaced!");
