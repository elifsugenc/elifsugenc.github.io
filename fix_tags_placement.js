const fs = require('fs');

function fixPlacement(p) {
  let html = fs.readFileSync(`projects/${p}/index.html`, 'utf8');
  
  // Extract tagsHTML (from <div class="project-tags" ... to </div>)
  const tagMatch = html.match(/<div class="project-tags".*?<\/div>/s);
  if (!tagMatch) return;
  const tagsHTML = tagMatch[0];
  
  // Remove existing
  html = html.replace(/\\n<div class="project-tags".*?<\/div>/s, "");
  html = html.replace(/<div class="project-tags".*?<\/div>/s, "");
  
  // Inject right after <span class="q-mark">?</span></span></div>
  html = html.replace(/(<span class="q-mark">\?<\/span><\/span><\/div>)/, "$1\\n" + tagsHTML);
  
  fs.writeFileSync(`projects/${p}/index.html`, html, 'utf8');
  console.log(p + " fixed.");
}

["stray", "bio-decay", "the-earthen"].forEach(fixPlacement);

