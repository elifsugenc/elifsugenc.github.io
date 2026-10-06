const fs = require('fs');
let html = fs.readFileSync('projects/bio-decay/index.html', 'utf8');
const tagsHTML = `<div class="project-tags" style="display: flex; gap: 12px; margin-top: 5px; align-items: center; flex-wrap: wrap;">
      <img src="/assets/tags/material-agency.png" alt="Material Agency" style="width: 50px; height: 50px;">
      <img src="/assets/tags/ecological.png" alt="Ecological" style="width: 50px; height: 50px;">
      <img src="/assets/tags/experimental.png" alt="Experimental" style="width: 50px; height: 50px;">
      <img src="/assets/tags/critical-inquiry.png" alt="Critical Inquiry" style="width: 50px; height: 50px;">
      <img src="/assets/tags/social-memory.png" alt="Social Memory" style="width: 50px; height: 50px;">
      <img src="/assets/tags/speculative.png" alt="Speculative" style="width: 50px; height: 50px;">
    </div>`;

html = html.replace(/<div class="detail-heading">.*?<h1[^>]*>.*?<\/h1>/s, (match) => { return match + "\n" + tagsHTML; });
fs.writeFileSync('projects/bio-decay/index.html', html, 'utf8');
console.log(html.includes("project-tags"));
