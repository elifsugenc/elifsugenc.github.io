const fs = require('fs');
let html = fs.readFileSync('projects/bajo-la-fresca/index.html', 'utf8');

const h1Regex = /<h1[^>]*>.*?<\/h1>/;
const match = html.match(h1Regex);

if(match) {
    const newInner = `Bajo La <span style="white-space: nowrap;">Fresca<span class="accent">.</span> <span style="font-size: clamp(1rem, 2vw, 1.5rem); font-weight: 400; color: var(--primary); font-style: italic; letter-spacing: 0.05em; vertical-align: middle; margin-left: 10px;">/ˈbaxo la ˈfɾeska/</span></span>`;
    
    const newH1 = `<h1 data-en='${newInner}' data-tr='${newInner}'>${newInner}</h1>`;
    
    html = html.replace(h1Regex, newH1);
    fs.writeFileSync('projects/bajo-la-fresca/index.html', html, 'utf8');
    console.log("Fixed H1 nowrap perfectly");
}
