const fs = require('fs');
let content = fs.readFileSync('assets/app.js', 'utf8');
content = content.replace(/wrapper\.style\.setProperty\('--img-src', \\url\(\\\)\\\);/, "wrapper.style.setProperty('--img-src', `url(${img.src})`);");
fs.writeFileSync('assets/app.js', content, 'utf8');
console.log("Fixed!");
