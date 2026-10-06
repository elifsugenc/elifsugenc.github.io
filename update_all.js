const fs = require('fs');
function cleanAndInject(p, tagsList) {
  let html = fs.readFileSync(`projects/${p}/index.html`, 'utf8');
  
  // Remove existing project-tags div entirely
  html = html.replace(/<div class="project-tags".*?<\/div>/s, "");
  
  let tagsHTML = `<div class="project-tags" style="display: flex; gap: 12px; margin-top: 15px; margin-bottom: 20px; align-items: center; flex-wrap: wrap;">\n`;
  tagsList.forEach(t => {
    let name = t.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    tagsHTML += `      <img src="/assets/tags/${t}.png" alt="${name}" style="width: 50px; height: 50px;">\n`;
  });
  tagsHTML += `    </div>`;
  
  // Inject right before the closing of detail-heading
  html = html.replace(/<\/div>\s*<\/div>\s*<(div|p)/, "</div>\\n" + tagsHTML + "\\n</div>\\n<$1");
  
  fs.writeFileSync(`projects/${p}/index.html`, html, 'utf8');
  console.log(p + " done. Tags included? " + html.includes("project-tags"));
}

cleanAndInject("stray", ["critical-inquiry", "experimental", "interactive", "social-memory"]);
cleanAndInject("bio-decay", ["material-agency", "ecological", "experimental", "critical-inquiry", "social-memory", "speculative"]);
cleanAndInject("the-earthen", ["ecological", "speculative", "experimental", "social-memory", "material-agency", "critical-inquiry"]);

