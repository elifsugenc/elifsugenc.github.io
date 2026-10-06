const fs = require('fs');
let code = fs.readFileSync('assets/projects.js', 'utf8');

const oldStr = '[[200,230],[800,230],[190,545],[810,540],[300,420]';
const newStr = '[[200,230],[800,230],[190,545],[810,540],[500,100]';

if (code.includes(oldStr)) {
    code = code.replace(oldStr, newStr);
    fs.writeFileSync('assets/projects.js', code, 'utf8');
    console.log("Updated bases array");
} else {
    console.log("String not found!");
}
