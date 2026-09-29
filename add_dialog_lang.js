const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const findStr = '<div class="consent" role="dialog" aria-modal="true" aria-labelledby="consent-title">';
const insertStr = '<div class="dialog-language lang-switch" aria-label="Language"><button type="button" data-lang="en">EN</button><span>/</span><button type="button" data-lang="tr">TR</button></div>';

walkDir('.', function(filePath) {
    if (filePath.endsWith('.html')) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        if (content.includes(findStr) && !content.includes('dialog-language')) {
            content = content.replace(findStr, findStr + insertStr);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Added lang switch to consent modal in ' + filePath);
        }
    }
});
