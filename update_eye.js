const fs = require('fs');
let html = fs.readFileSync('projects/index.html', 'utf8');
html = html.replace(/Does death exist because life exists,<br>or does life exist because death exists/g, "Is there death because there is life");
fs.writeFileSync('projects/index.html', html, 'utf8');
console.log("HTML updated");

let jsCode = fs.readFileSync('assets/projects.js', 'utf8');
jsCode = jsCode.replace(/Does death exist because life exists,<br>or does life exist because death exists/g, "Is there death because there is life");
fs.writeFileSync('assets/projects.js', jsCode, 'utf8');
console.log("JS updated");
