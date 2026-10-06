const fs = require('fs');
let html = fs.readFileSync('projects/stray/index.html', 'utf8');
const tagsHTML = `<div class="project-tags" style="display: flex; gap: 12px; margin-bottom: 20px; align-items: center; flex-wrap: wrap;">
      <img src="/assets/tags/critical-inquiry.png" alt="Critical Inquiry" style="width: 50px; height: 50px;">
      <img src="/assets/tags/experimental.png" alt="Experimental" style="width: 50px; height: 50px;">
      <img src="/assets/tags/interactive.png" alt="Interactive" style="width: 50px; height: 50px;">
      <img src="/assets/tags/social-memory.png" alt="Social Memory" style="width: 50px; height: 50px;">
    </div>`;
html = html.replace(/<p class="detail-body">/, tagsHTML + "<p class=\"detail-body\">");
fs.writeFileSync('projects/stray/index.html', html, 'utf8');
console.log(html.includes("project-tags"));
