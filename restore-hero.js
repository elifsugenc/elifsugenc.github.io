const fs = require('fs');
let html = fs.readFileSync('projects/bajo-la-fresca/index.html', 'utf8');

// Find the end of the grid:
// </div>
//     </div>
//
//     <p class="detail-body" style="font-style: italic;

const searchStr = `        </div>
    </div>

    <p class="detail-body" style="font-style: italic;`;

const replacement = `        </div>
    </div>

    <div class="detail-image" style="margin-bottom: 40px;">
        <img src="/assets/bajo-la-fresca-hero-2.jpg" class="lightbox-trigger" data-index="1" alt="Bajo La Fresca - Installation View" style="width: 100%; height: auto; display: block; cursor: pointer; border-radius: 4px;">
    </div>

    <p class="detail-body" style="font-style: italic;`;

if (html.includes(searchStr)) {
    html = html.replace(searchStr, replacement);
    fs.writeFileSync('projects/bajo-la-fresca/index.html', html, 'utf8');
    console.log("Restored hero image as lightbox trigger");
} else {
    console.log("Could not find insertion point.");
}

