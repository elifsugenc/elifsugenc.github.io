const fs = require('fs');
["stray", "bio-decay", "the-earthen"].forEach(p => {
  let html = fs.readFileSync(`projects/${p}/index.html`, 'utf8');
  html = html.replace(/\\n/g, "");
  fs.writeFileSync(`projects/${p}/index.html`, html, 'utf8');
  console.log(p + " fixed.");
});
