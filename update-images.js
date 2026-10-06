const fs = require('fs');
let html = fs.readFileSync('projects/bajo-la-fresca/index.html', 'utf8');

// Replace main image
html = html.replace('<img src="/assets/bajo-la-fresca-hero.jpg"', '<img src="/assets/bajo-la-fresca-hero-2.jpg"');

// Add media section before the closing </div> of detail-body
const mediaHtml = `
    <div style="margin-top: 60px; margin-bottom: 20px;">
        <h3 style="font-size: 0.9rem; letter-spacing: 0.1em; color: var(--primary); margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 10px;" data-en="MEDIA" data-tr="MEDYA">MEDIA</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
            <img src="/assets/bajo-la-fresca-hero.jpg" alt="Installation Detail 1" style="width: 100%; border-radius: 4px; display: block;">
            <img src="/assets/bajo-la-fresca-hero-2.jpg" alt="Installation Detail 2" style="width: 100%; border-radius: 4px; display: block;">
        </div>
    </div>
`;

// Find the last </p> before </div> of detail-body
const lastP = 'socializing refuge.</p>';
if (html.includes(lastP)) {
    html = html.replace(lastP, lastP + "\\n" + mediaHtml);
} else {
    console.log("Could not find insertion point!");
}

fs.writeFileSync('projects/bajo-la-fresca/index.html', html, 'utf8');
console.log("Updated images");

