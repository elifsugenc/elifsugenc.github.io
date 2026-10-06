const fs = require('fs');
let html = fs.readFileSync('projects/bajo-la-fresca/index.html', 'utf8');

// The image is: <img src="/assets/bajo-la-fresca-hero-2.jpg" alt="Bajo La Fresca - Installation View" style="width: 100%; height: auto; display: block; margin-bottom: 40px; border-radius: 4px;">

const imgOriginal = `<img src="/assets/bajo-la-fresca-hero-2.jpg" alt="Bajo La Fresca - Installation View" style="width: 100%; height: auto; display: block; margin-bottom: 40px; border-radius: 4px;">`;
const imgReplacement = `<img src="/assets/bajo-la-fresca-hero-2.jpg" class="lightbox-trigger" data-index="1" alt="Bajo La Fresca - Installation View" style="width: 100%; height: auto; display: block; margin-bottom: 40px; border-radius: 4px; cursor: pointer;">`;

if(html.includes(imgOriginal)) {
    html = html.replace(imgOriginal, imgReplacement);
    fs.writeFileSync('projects/bajo-la-fresca/index.html', html, 'utf8');
    console.log("Updated hero image to be a lightbox trigger");
} else {
    console.log("Could not find the exact image tag to replace");
}

