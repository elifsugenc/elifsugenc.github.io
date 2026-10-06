const fs = require('fs');
let css = fs.readFileSync('assets/style.css', 'utf8');

// Remove the ::before entirely
css = css.replace(/\.tag-wrapper::before \{[\s\S]*?\}/, "");
css = css.replace(/\.tag-wrapper:hover::before \{[\s\S]*?\}/, "");

// Modify the img states
css = css.replace(/\.tag-wrapper img \{[\s\S]*?\}/, `.tag-wrapper img {
    width: 100%;
    height: 100%;
    transition: transform 0.25s ease, opacity 0.25s ease, filter 0.25s ease;
    opacity: 0.65;
}`);

css = css.replace(/\.tag-wrapper:hover img \{[\s\S]*?\}/, `.tag-wrapper:hover img {
    transform: scale(1.15) translateY(-3px);
    opacity: 1; 
    filter: drop-shadow(0 0 6px var(--primary));
}`);

// Modify the text ::after to match
css = css.replace(/\.tag-wrapper::after \{[\s\S]*?\}/, `.tag-wrapper::after {
    content: attr(data-name);
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.75rem;
    font-family: monospace;
    font-weight: bold;
    white-space: nowrap;
    opacity: 0;
    color: var(--primary);
    transition: opacity 0.25s ease, transform 0.25s ease;
    pointer-events: none;
    text-transform: uppercase;
}`);

css = css.replace(/\.tag-wrapper:hover::after \{[\s\S]*?\}/, `.tag-wrapper:hover::after {
    opacity: 1;
    transform: translateX(-50%) translateY(5px);
}`);

fs.writeFileSync('assets/style.css', css, 'utf8');
console.log("CSS updated to use drop-shadow");

