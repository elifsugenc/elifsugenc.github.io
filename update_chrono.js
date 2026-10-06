const fs = require('fs');
let html = fs.readFileSync('projects/chronoclines/index.html', 'utf8');
const tagsHTML = `<div class="project-tags" style="display: flex; gap: 12px; margin-top: 5px; align-items: center; flex-wrap: wrap;">
      <img src="/assets/tags/social-memory.png" alt="Social Memory" style="width: 50px; height: 50px;">
      <img src="/assets/tags/critical-inquiry.png" alt="Critical Inquiry" style="width: 50px; height: 50px;">
    </div>`;

html = html.replace(/<div class="detail-heading">.*?<h1[^>]*>.*?<\/h1>/s, (match) => { return match + "\n" + tagsHTML; });
fs.writeFileSync('projects/chronoclines/index.html', html, 'utf8');
console.log("HTML:", html.includes("project-tags"));

let c = fs.readFileSync('assets/projects.js', 'utf8');
c = c.replace(/const projectTags = \{/, "const projectTags = {\n    'chronoclines': ['social-memory', 'critical-inquiry'],");
fs.writeFileSync('assets/projects.js', c, 'utf8');
console.log("JS:", c.includes("chronoclines"));

