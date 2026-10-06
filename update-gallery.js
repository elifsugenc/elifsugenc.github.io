const fs = require('fs');
let html = fs.readFileSync('projects/bajo-la-fresca/index.html', 'utf8');

// 1. Remove the large images
const largeImgRegex = /<div class="detail-section"[^>]*>[\s\S]*?<span class="eyebrow"[^>]*>MEDIA<\/span>\s*<\/div>\s*<div class="detail-image"[^>]*>\s*<img[^>]*>\s*<\/div>\s*<div class="detail-image"[^>]*>\s*<img[^>]*>\s*<\/div>/g;

// 2. Create the new media grid structure
const newMediaGrid = `
<div class="detail-section" style="margin-bottom: 80px;">
    <span class="eyebrow" style="margin-bottom: 20px; display: block;" data-en="MEDIA" data-tr="MEDYA">MEDIA</span>
    <div class="media-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
        <div class="media-thumb" data-index="0" title="Installation Detail 1" style="background-image: url('/assets/bajo-la-fresca-hero.jpg');"></div>
        <div class="media-thumb" data-index="1" title="Installation Detail 2" style="background-image: url('/assets/bajo-la-fresca-hero-2.jpg');"></div>
    </div>
</div>
`;

// Replace it
let replaced = false;
html = html.replace(largeImgRegex, () => {
    replaced = true;
    return newMediaGrid;
});

if (!replaced) {
    console.log("Could not find the target section to replace.");
}

// 3. Add the Lightbox JS and HTML at the end before </body>
const lightboxHTML = `
<script>
document.addEventListener("DOMContentLoaded", () => {
    const galleryItems = [
        { src: '/assets/bajo-la-fresca-hero.jpg', label: 'Installation Detail 1' },
        { src: '/assets/bajo-la-fresca-hero-2.jpg', label: 'Installation Detail 2' }
    ];
    let currentImageIndex = 0;
    let isZoomed = false;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const counter = document.querySelector('.lightbox-counter');

    document.querySelectorAll('.media-thumb, .lightbox-trigger').forEach(thumb => {
        thumb.addEventListener('click', (e) => {
            currentImageIndex = parseInt(e.currentTarget.getAttribute('data-index'));
            showImage(currentImageIndex);
            lightbox.hidden = false;
        });
    });

    function showImage(index) {
        if (index < 0) index = galleryItems.length - 1;
        if (index >= galleryItems.length) index = 0;
        currentImageIndex = index;
        
        isZoomed = false;
        lightboxImg.classList.remove('zoomed');
        lightboxImg.style.transformOrigin = 'center center';
        
        lightboxImg.src = galleryItems[currentImageIndex].src;
        if(counter) {
            counter.textContent = \`\${currentImageIndex + 1} / \${galleryItems.length} — \${galleryItems[currentImageIndex].label}\`;
        }
    }
    
    function panImage(e) {
        if (!isZoomed) return;
        const rect = lightboxImg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;
        lightboxImg.style.transformOrigin = \`\${xPercent}% \${yPercent}%\`;
    }

    lightboxImg.addEventListener('click', (e) => {
        e.stopPropagation();
        isZoomed = !isZoomed;
        if (isZoomed) {
            lightboxImg.classList.add('zoomed');
            panImage(e);
        } else {
            lightboxImg.classList.remove('zoomed');
            lightboxImg.style.transformOrigin = 'center center';
        }
    });

    lightboxImg.addEventListener('mousemove', (e) => {
        if (isZoomed) panImage(e);
    });

    document.querySelector('.lightbox-close').addEventListener('click', () => {
        lightbox.hidden = true;
    });
    document.querySelector('.lightbox-prev').addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentImageIndex - 1);
    });
    document.querySelector('.lightbox-next').addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentImageIndex + 1);
    });
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.hidden = true;
    });
});
</script>

<div id="lightbox" class="lightbox" hidden>
    <button class="lightbox-close">×</button>
    <button class="lightbox-prev">←</button>
    <img id="lightbox-img" src="" alt="Gallery Image">
    <button class="lightbox-next">→</button>
    <div class="lightbox-counter">1 / 2</div>
</div>
`;

if (replaced && !html.includes('id="lightbox"')) {
    html = html.replace('</body>', lightboxHTML + "\\n</body>");
}

fs.writeFileSync('projects/bajo-la-fresca/index.html', html, 'utf8');
console.log("Lightbox gallery implemented");

