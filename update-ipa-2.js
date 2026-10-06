const fs = require('fs');
let html = fs.readFileSync('projects/bajo-la-fresca/index.html', 'utf8');

// Replace the H1
html = html.replace(
  /<h1 data-en="Bajo La Fresca<span class='accent'>\.<\/span>" data-tr="Bajo La Fresca<span class='accent'>\.<\/span>">Bajo La Fresca<span class="accent">\.<\/span><\/h1>/,
  `<h1 data-en="Bajo La Fresca<span class='accent'>.</span> <span style='font-size: clamp(1rem, 2vw, 1.5rem); font-weight: 400; color: var(--primary); font-style: italic; letter-spacing: 0.05em; vertical-align: middle; margin-left: 10px;'>/ˈbaxo la ˈfɾeska/</span>" data-tr="Bajo La Fresca<span class='accent'>.</span> <span style='font-size: clamp(1rem, 2vw, 1.5rem); font-weight: 400; color: var(--primary); font-style: italic; letter-spacing: 0.05em; vertical-align: middle; margin-left: 10px;'>/ˈbaxo la ˈfɾeska/</span>">Bajo La Fresca<span class="accent">.</span> <span style="font-size: clamp(1rem, 2vw, 1.5rem); font-weight: 400; color: var(--primary); font-style: italic; letter-spacing: 0.05em; vertical-align: middle; margin-left: 10px;">/ˈbaxo la ˈfɾeska/</span></h1>`
);

fs.writeFileSync('projects/bajo-la-fresca/index.html', html, 'utf8');
console.log("Updated H1");

