const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const findStr = '<h2 id="consent-title" data-en="May this site remember your gestures?" data-tr="Bu site hareketlerinizi hatırlayabilir mi?">May this site remember your gestures?</h2>';
const replaceStr = '<h2 id="consent-title" data-en="May this site remember you?" data-tr="Bu site sizi hatırlayabilir mi?">May this site remember you?</h2>';

walkDir('.', function(filePath) {
    if (filePath.endsWith('.html')) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        if (content.includes(findStr)) {
            content = content.replace(findStr, replaceStr);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Updated ' + filePath);
        } else if (content.includes('remember your gestures?')) {
            console.log('Found variation in ' + filePath);
        }
    }
});
