const fs = require('fs');
let c = fs.readFileSync('assets/projects.js', 'utf8');
c = c.replace(/const projectTags = \{/, "const projectTags = {\n    'stray': ['critical-inquiry', 'experimental', 'interactive', 'social-memory'],");
fs.writeFileSync('assets/projects.js', c, 'utf8');
console.log("Updated projects.js");
