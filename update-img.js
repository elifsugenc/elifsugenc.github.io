const fs = require('fs');
let html = fs.readFileSync('projects/bajo-la-fresca/index.html', 'utf8');

// Insert the image at the top of detail-body
html = html.replace(
  /<div class="detail-body">/,
  `<div class="detail-body">\n    <img src="/assets/bajo-la-fresca-hero.jpg" alt="Bajo La Fresca - Installation View" style="width: 100%; height: auto; display: block; margin-bottom: 40px; border-radius: 4px;">`
);

fs.writeFileSync('projects/bajo-la-fresca/index.html', html, 'utf8');
console.log("Image added!");

