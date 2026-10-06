const fs = require('fs');
let html = fs.readFileSync('projects/bajo-la-fresca/index.html', 'utf8');
const styleBlock = `
<style>
/* Gallery & Lightbox Styles */
.media-thumb {
    aspect-ratio: 1;
    background-size: cover;
    background-position: center;
    cursor: pointer;
    border-radius: 4px;
    transition: transform 0.2s ease, opacity 0.2s ease;
}
.media-thumb:hover {
    transform: scale(1.02);
    opacity: 0.9;
}
.lightbox {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.95);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
}
.lightbox[hidden] {
    display: none !important;
}
.lightbox-close {
    position: absolute;
    top: 20px; right: 20px;
    background: none; border: none;
    color: white; font-size: 2rem; cursor: pointer;
    z-index: 10000;
}
.lightbox-prev, .lightbox-next {
    position: absolute;
    top: 50%; transform: translateY(-50%);
    background: none; border: none;
    color: white; font-size: 2rem; cursor: pointer;
    z-index: 10000;
    padding: 20px;
}
.lightbox-prev { left: 20px; }
.lightbox-next { right: 20px; }
.lightbox img {
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
    transition: transform 0.3s cubic-bezier(0.2, 0, 0, 1);
    cursor: zoom-in;
}
.lightbox img.zoomed {
    cursor: grab;
    transform: scale(2);
}
.lightbox img.zoomed:active {
    cursor: grabbing;
}
.lightbox-counter {
    position: absolute;
    bottom: 20px; left: 50%; transform: translateX(-50%);
    color: rgba(255,255,255,0.7);
    font-family: monospace; font-size: 0.9rem;
    pointer-events: none;
}
</style>
`;
if (!html.includes('.media-thumb')) {
    html = html.replace('</head>', styleBlock + '</head>');
} else if (!html.includes('aspect-ratio: 1;')) {
    html = html.replace('</head>', styleBlock + '</head>');
}

fs.writeFileSync('projects/bajo-la-fresca/index.html', html, 'utf8');
console.log("Added missing styles");

