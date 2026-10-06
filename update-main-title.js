const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldStr = 'data-en="Traces, together<span class=\'accent\'>.</span>" data-tr="İzler, birlikte<span class=\'accent\'>.</span>">Traces, together<span class="accent">.</span></h2>';
const newStr = 'data-en="you were here<span class=\'accent\'>.</span>" data-tr="you were here<span class=\'accent\'>.</span>">you were here<span class="accent">.</span></h2>';

if (html.includes(oldStr)) {
    html = html.replace(oldStr, newStr);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log("Updated index.html");
} else {
    // If it was already replaced or didn't match perfectly
    // Try regex
    html = html.replace(/<h2 data-en="Traces, together.*?<\/h2>/, '<h2 data-en="you were here<span class=\'accent\'>.</span>" data-tr="you were here<span class=\'accent\'>.</span>">you were here<span class="accent">.</span></h2>');
    fs.writeFileSync('index.html', html, 'utf8');
    console.log("Updated using regex");
}
