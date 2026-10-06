const fs = require('fs');
let html = fs.readFileSync('projects/bajo-la-fresca/index.html', 'utf8');

// 1. Update the title
html = html.replace(
  /<h1 class="project-title">Bajo La Fresca<span class="accent">\.<\/span><\/h1>/,
  `<h1 class="project-title">Bajo La Fresca<span class="accent">.</span> <span style="font-size: clamp(1rem, 2vw, 1.5rem); font-weight: 400; color: var(--primary); font-style: italic; letter-spacing: 0.05em; vertical-align: middle; margin-left: 10px;">/'baxo la 'fɾeska/</span></h1>`
);

// 2. Remove the IPA from the description block
html = html.replace(/ \( \/'baxo la 'fɾeska\/ \)/g, "");

fs.writeFileSync('projects/bajo-la-fresca/index.html', html, 'utf8');
console.log("Updated title and description");

