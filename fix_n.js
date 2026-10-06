const fs = require('fs');
["stray", "bio-decay", "the-earthen"].forEach(p => {
  let html = fs.readFileSync(`projects/${p}/index.html`, 'utf8');
  html = html.replace(/<\/div>\\n<div class="project-tags"/g, "</div>\n<div class=\"project-tags\"");
  fs.writeFileSync(`projects/${p}/index.html`, html, 'utf8');
  console.log(p + " fixed.");
});
