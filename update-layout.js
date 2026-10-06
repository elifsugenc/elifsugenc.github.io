const fs = require('fs');
let html = fs.readFileSync('projects/bajo-la-fresca/index.html', 'utf8');

// We need to replace the entire MEDIA block inside the detail-body with a new structure OUTSIDE it.
// The current structure at the bottom of the file looks like this:
/*
    <div style="margin-top: 60px; margin-bottom: 20px;">
        <h3 style="font-size: 0.9rem; letter-spacing: 0.1em; color: var(--primary); margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 10px;" data-en="MEDIA" data-tr="MEDYA">MEDIA</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
            <img src="/assets/bajo-la-fresca-hero.jpg" alt="Installation Detail 1" style="width: 100%; border-radius: 4px; display: block;">
            <img src="/assets/bajo-la-fresca-hero-2.jpg" alt="Installation Detail 2" style="width: 100%; border-radius: 4px; display: block;">
        </div>
    </div>

</div>
*/

const mediaBlockRegex = /<div style="margin-top: 60px; margin-bottom: 20px;">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

// Wait, the regex might be tricky. Let's just use string replace.

const searchString = `    <div style="margin-top: 60px; margin-bottom: 20px;">
        <h3 style="font-size: 0.9rem; letter-spacing: 0.1em; color: var(--primary); margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 10px;" data-en="MEDIA" data-tr="MEDYA">MEDIA</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
            <img src="/assets/bajo-la-fresca-hero.jpg" alt="Installation Detail 1" style="width: 100%; border-radius: 4px; display: block;">
            <img src="/assets/bajo-la-fresca-hero-2.jpg" alt="Installation Detail 2" style="width: 100%; border-radius: 4px; display: block;">
        </div>
    </div>

</div>`;

const newStructure = `</div>

<div class="detail-section" style="margin-bottom: 40px; align-items: flex-start; max-width: 780px; margin-left: auto; margin-right: auto;">
    <span class="eyebrow" style="margin-bottom: 20px; display: block;" data-en="MEDIA" data-tr="MEDYA">MEDIA</span>
</div>

<div class="detail-image" style="margin-bottom: 40px;">
    <img src="/assets/bajo-la-fresca-hero.jpg" alt="Installation Detail 1" style="width: 100%; height: auto; display: block; border-radius: 4px;">
</div>
<div class="detail-image" style="margin-bottom: 40px;">
    <img src="/assets/bajo-la-fresca-hero-2.jpg" alt="Installation Detail 2" style="width: 100%; height: auto; display: block; border-radius: 4px;">
</div>
`;

if (html.includes(searchString)) {
    html = html.replace(searchString, newStructure);
    fs.writeFileSync('projects/bajo-la-fresca/index.html', html, 'utf8');
    console.log("Updated layout successfully");
} else {
    console.log("Could not find the exact string.");
}

