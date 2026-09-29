const fs = require('fs');

let content = fs.readFileSync('projects/index.html', 'utf8');
const replacements = [
    ['<span class="eyebrow">PORTFOLIO / WORK</span>', '<span class="eyebrow" data-en="PORTFOLIO / WORK" data-tr="PORTFOLYO / İŞLER">PORTFOLIO / WORK</span>'],
    ['<h1>Projects<span class="accent">.</span></h1>', '<h1 data-en="Projects<span class=\'accent\'>.</span>" data-tr="Projeler<span class=\'accent\'>.</span>">Projects<span class="accent">.</span></h1>'],
    ['<span>Emek\n                        Museum<span class="accent">.</span></span>', '<span data-en="Emek Museum<span class=\'accent\'>.</span>" data-tr="Emek Müzesi<span class=\'accent\'>.</span>">Emek Museum<span class="accent">.</span></span>'],
    ['<span>ara-sira<span class="accent">.</span></span>', '<span data-en="ara-sira<span class=\'accent\'>.</span>" data-tr="ara-sıra<span class=\'accent\'>.</span>">ara-sira<span class="accent">.</span></span>']
];

for (const [search, replace] of replacements) {
    if (content.includes(search)) {
        content = content.replace(search, replace);
    }
}
fs.writeFileSync('projects/index.html', content, 'utf8');
console.log('Updated projects/index.html');
