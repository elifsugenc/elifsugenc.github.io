const fs = require('fs');
let css = fs.readFileSync('assets/style.css', 'utf8');

// We need to change the hover effect in .tag-wrapper
css = css.replace(/opacity: 0;\s*}/, "opacity: 1;\n}"); // Keep original image visible on hover

css = css.replace(/\.tag-wrapper::before \{[\s\S]*?\}/, `.tag-wrapper::before {
    content: "";
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background-color: var(--primary);
    -webkit-mask-image: var(--img-src);
    -webkit-mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    mask-image: var(--img-src);
    mask-size: contain;
    mask-repeat: no-repeat;
    mix-blend-mode: multiply;
    opacity: 0;
    transition: opacity 0.25s ease, transform 0.25s ease;
    pointer-events: none;
    z-index: 2;
}`);

css = css.replace(/\.tag-wrapper:hover img \{[\s\S]*?\}/, `.tag-wrapper:hover img {
    transform: scale(1.15);
    opacity: 1; 
}`);

fs.writeFileSync('assets/style.css', css, 'utf8');
console.log("CSS updated");
