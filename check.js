const fs = require('fs');
["stray", "bio-decay", "the-earthen"].forEach(p => {
  const html = fs.readFileSync(`projects/${p}/index.html`, 'utf8');
  const d = html.split('<div class="detail-heading">')[1];
  console.log(p + ": " + d.match(/<\/div>\s*<\/div>\s*<(div|p)/)[0]);
});
