const fs = require('fs');
let html = fs.readFileSync('projects/bajo-la-fresca/index.html', 'utf8');
const newContent = Buffer.from(fs.readFileSync('b64.txt', 'utf8'), 'base64').toString('utf8').replace(/peyzaj`yaratmak/g, 'peyzaj yaratmak');

let match = html.match(/<div class="detail-body">[\s\S\r\n]*?<\/div>\s*<p class="detail-body detail-pending"[\s\S\r\n]*?<\/p>/);
if(match) {
    html = html.replace(match[0], newContent + "\n");
} else {
    let match2 = html.match(/<div class="detail-body">[\s\S\r\n]*?<\/article>/);
    if(match2) {
        html = html.replace(match2[0], newContent + "\n</article>");
    }
}
fs.writeFileSync('projects/bajo-la-fresca/index.html', html, 'utf8');
console.log('DONE');

