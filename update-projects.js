const fs = require('fs');
let html = fs.readFileSync('projects/index.html', 'utf8');

// Replace question
html = html.replace(/Why trace matters<span class="q-mark">\\?<\/span>/g, 'What remains of the movements we forget<span class="q-mark">?</span>');

// The Turkish translation for the question
// The user provided the English question: "What remains of the movements we forget?"
// TR translation: "Unuttuğumuz hareketlerden geriye ne kalır?"
// Let's just replace the English first and then the Turkish data-en/data-tr attributes.

// Let's do a regex replacement on the exact node:
const nodeRegex = /<a class="network-project network-project-5"\s*href="\/projects\/traces-together\/" data-node="4"><span>Why trace matters<span class="q-mark">\\?<\/span><\/span><span class="network-arrow">↗<\/span><\/a>/g;

const newNode = `<a class="network-project network-project-5"
                      href="/projects/traces-together/" data-node="4"><span data-en="What remains of the movements we forget<span class='q-mark'>?</span>" data-tr="Unuttuğumuz hareketlerden geriye ne kalır<span class='q-mark'>?</span>">What remains of the movements we forget<span class="q-mark">?</span></span><span class="network-arrow">↗</span></a>`;

if (html.match(nodeRegex)) {
    html = html.replace(nodeRegex, newNode);
} else {
    // maybe without the exact spacing
    html = html.replace(/<span>Why trace matters<span class="q-mark">\\?<\/span><\/span>/, `<span data-en="What remains of the movements we forget<span class='q-mark'>?</span>" data-tr="Unuttuğumuz hareketlerden geriye ne kalır<span class='q-mark'>?</span>">What remains of the movements we forget<span class="q-mark">?</span></span>`);
}

// Replace title in the list
// <li data-id="traces-together"><a href="/projects/traces-together/"><span class="project-title">The Trace</span></a></li>
html = html.replace(/<span class="project-title">The Trace<\/span>/, `<span class="project-title">you were here.</span>`);

fs.writeFileSync('projects/index.html', html, 'utf8');
console.log("Updated projects/index.html");

