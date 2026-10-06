const fs = require('fs');
let html = fs.readFileSync('projects/bio-decay/index.html', 'utf8');

html = html.replace(/BIO-DECAY/g, 'Bio-Decay');

fs.writeFileSync('projects/bio-decay/index.html', html, 'utf8');
console.log('Replaced BIO-DECAY with Bio-Decay');
