const fs = require('fs');
let html = fs.readFileSync('projects/bajo-la-fresca/index.html', 'utf8');
html = html.replace(/<span>Critical Matter Workshop \/ Group<br>/, "<span>Festival Efímera<br>");
fs.writeFileSync('projects/bajo-la-fresca/index.html', html, 'utf8');
console.log("Replaced!");
