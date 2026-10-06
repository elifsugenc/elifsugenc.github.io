const fs = require('fs');
let c = fs.readFileSync('assets/projects.js', 'utf8');
c = c.replace(/const projectTags = \{/, "const projectTags = {\n    'bio-decay': ['material-agency', 'ecological', 'experimental', 'critical-inquiry', 'social-memory', 'speculative'],");
fs.writeFileSync('assets/projects.js', c, 'utf8');
console.log(c.includes("bio-decay"));
