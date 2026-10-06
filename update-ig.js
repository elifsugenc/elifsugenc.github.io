const fs = require('fs');
let html = fs.readFileSync('projects/bajo-la-fresca/index.html', 'utf8');
html = html.replace(/<span>Critical Matter Workshop \/ Group<\/span>/, "<span>Critical Matter Workshop / Group<br><a href=\"https://instagram.com/efimera_fest\" target=\"_blank\" style=\"display: inline-block; margin-top: 8px; color: var(--primary); text-decoration: underline; font-weight: 500;\" data-en=\"Festival: @efimera_fest ↗\" data-tr=\"Festival: @efimera_fest ↗\">Festival: @efimera_fest ↗</a></span>");
fs.writeFileSync('projects/bajo-la-fresca/index.html', html, 'utf8');
console.log("Replaced!");
