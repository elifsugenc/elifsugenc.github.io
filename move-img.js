const fs = require('fs');
let html = fs.readFileSync('projects/bajo-la-fresca/index.html', 'utf8');

// 1. Remove the image from the top
const imgTag = `<img src="/assets/bajo-la-fresca-hero.jpg" alt="Bajo La Fresca - Installation View" style="width: 100%; height: auto; display: block; margin-bottom: 40px; border-radius: 4px;">`;
html = html.replace(imgTag + "\n", ""); // Also remove the newline if possible
html = html.replace(imgTag, "");

// 2. Find the grid block and insert the image right after it
// The grid starts with: <div style="display: grid;
// and ends with: </div>\n
// Wait, the grid contains 3 inner divs, so it ends after the 4th </div> counting from the start of the grid.

const gridStartIdx = html.indexOf('<div style="display: grid;');
const nextPIdx = html.indexOf('<p class="detail-body" style="font-style: italic;', gridStartIdx);

if (gridStartIdx !== -1 && nextPIdx !== -1) {
    // We insert it right before nextPIdx
    html = html.slice(0, nextPIdx) + imgTag + "\n\n    " + html.slice(nextPIdx);
}

fs.writeFileSync('projects/bajo-la-fresca/index.html', html, 'utf8');
console.log("Moved image below the grid");

