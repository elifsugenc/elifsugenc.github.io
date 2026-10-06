const fs = require('fs');
const path = require('path');

function walk(d) {
    fs.readdirSync(d).forEach(f => {
        const p = path.join(d, f);
        if (fs.statSync(p).isDirectory()) {
            if (f !== 'node_modules' && f !== '.git') walk(p);
        } else if (f.endsWith('.html')) {
            let buf = fs.readFileSync(p);
            if (buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
                console.log('Removed BOM from: ' + p);
                fs.writeFileSync(p, buf.slice(3));
            }
        }
    });
}
walk('.');