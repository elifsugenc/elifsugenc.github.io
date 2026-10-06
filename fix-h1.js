const fs = require('fs');
let html = fs.readFileSync('projects/bajo-la-fresca/index.html', 'utf8');

const h1Regex = /<h1[^>]*>.*?<\/h1>/;
const match = html.match(h1Regex);

if(match) {
    const newInner = `Bajo La Fresca<span style="white-space: nowrap;"><span class="accent">.</span> <span style="font-size: clamp(1rem, 2vw, 1.5rem); font-weight: 400; color: var(--primary); font-style: italic; letter-spacing: 0.05em; vertical-align: middle; margin-left: 10px;">/ˈbaxo la ˈfɾeska/</span></span>`;
    
    // We use double quotes for the attributes because newInner contains double quotes? No, newInner contains double quotes inside it, so we should use single quotes for data-en.
    const newH1 = `<h1 data-en='${newInner}' data-tr='${newInner}'>${newInner}</h1>`;
    
    html = html.replace(h1Regex, newH1);
    fs.writeFileSync('projects/bajo-la-fresca/index.html', html, 'utf8');
    console.log("Fixed H1 nowrap");
}
