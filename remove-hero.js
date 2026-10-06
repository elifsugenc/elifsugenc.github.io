const fs = require('fs');
let html = fs.readFileSync('projects/bajo-la-fresca/index.html', 'utf8');
html = html.replace('<img src="/assets/bajo-la-fresca-hero-2.jpg" alt="Bajo La Fresca - Installation View" style="width: 100%; height: auto; display: block; margin-bottom: 40px; border-radius: 4px;">\\n\\n    ', '');
fs.writeFileSync('projects/bajo-la-fresca/index.html', html, 'utf8');
console.log("Removed hero image");

