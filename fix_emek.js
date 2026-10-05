const fs = require('fs');
const filePath = 'projects/emek-museum/index.html';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove the old ongoing project paragraph
const oldOngoing = '<p class="detail-body detail-pending" style="margin-bottom: 2em; display: block;" data-en="-ongoing project-" data-tr="-devam eden proje-">-ongoing project-</p>';
content = content.replace(oldOngoing, '');

// 2. Reduce gap and add new ongoing project
const headingTarget = '<div class="detail-heading">';
const newHeading = '<div class="detail-heading" style="margin-bottom: 40px; min-height: auto;">';

const eyebrowTarget = '<span class="eyebrow" data-en="PROJECT" data-tr="PROJE">PROJECT</span>';
const newEyebrow = '<span class="eyebrow" data-en="PROJECT" data-tr="PROJE">PROJECT</span><span style="font-family: Georgia, serif; font-style: italic; display: block; margin-top: 10px; font-size: 1.1rem; color: #555;" data-en="-ongoing project-" data-tr="-devam eden proje-">-ongoing project-</span>';

content = content.replace(headingTarget, newHeading);
content = content.replace(eyebrowTarget, newEyebrow);

fs.writeFileSync(filePath, content, 'utf8');
console.log('done');
