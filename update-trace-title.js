const fs = require('fs');
let html = fs.readFileSync('projects/traces-together/index.html', 'utf8');

// Replace <title>
html = html.replace(/<title>Traces Together &mdash;/i, '<title>you were here. &mdash;');

// Replace heading and main question
const headingRegex = /<h1[^>]*>Traces Together<span class="accent">\.<\/span><\/h1>\s*<span[^>]*>why trace matters<span class="q-mark">\?<\/span><\/span>/i;
// wait, the actual html is: 
// <h1 class="stray-title-wrapper" style="margin: 20px 0; display: inline-block; flex-shrink: 0;" data-en="Traces Together<span class='accent'>.</span>" data-tr="İzler Birlikte<span class='accent'>.</span>">Traces Together<span class="accent">.</span></h1>
// <span style="font-size: clamp(1.2rem, 2vw, 1.65rem); white-space: nowrap;">why trace matters<span class="q-mark">?</span></span>

// Better string replacement:
html = html.replace(/data-en="Traces Together<span class='accent'>\.<\/span>"\s*data-tr="[^"]*"/, `data-en="you were here<span class='accent'>.</span>" data-tr="you were here<span class='accent'>.</span>"`);
html = html.replace(/>Traces Together<span class="accent">\.<\/span><\/h1>/, `>you were here<span class="accent">.</span></h1>`);
html = html.replace(/why trace matters<span class="q-mark">\?<\/span><\/span>/i, `What remains of the movements we forget<span class="q-mark">?</span></span>`);
// add data-en and data-tr to the span if they aren't there
html = html.replace(/<span style="font-size: clamp\(1\.2rem, 2vw, 1\.65rem\); white-space: nowrap;">What remains/, `<span style="font-size: clamp(1.2rem, 2vw, 1.65rem); white-space: nowrap;" data-en="What remains of the movements we forget<span class='q-mark'>?</span>" data-tr="Unuttuğumuz hareketlerden geriye ne kalır<span class='q-mark'>?</span>">What remains`);

// Insert additional questions right before the <div style="display: flex; flex-direction: column; gap: 30px; margin-top: 40px; ...">
const questionsEN = "What would browsing look like if every movement left a visible mark?<br>Can a cursor draw a portrait of our visit?<br>Would we move differently if we could see our traces?";
const questionsTR = "Her hareket görünür bir iz bıraksaydı, gezinmek nasıl görünürdü?<br>Bir imleç ziyaretimizin portresini çizebilir mi?<br>İzlerinizi görebilseydik daha farklı hareket eder miydik?";
const questionsHtml = `<div style="margin-top: 25px; margin-bottom: 20px;">
    <p class="detail-body" style="font-size: clamp(1.1rem, 2vw, 1.3rem); line-height: 1.6; color: var(--primary); font-style: italic; font-weight: 500;" data-en="${questionsEN}" data-tr="${questionsTR}">${questionsEN}</p>
</div>`;

const searchGrid = `<div style="display: flex; flex-direction: column; gap: 30px; margin-top: 40px; font-size: 0.9rem; color: #888; line-height: 1.5; letter-spacing: 0.02em;">`;
if (html.includes(searchGrid)) {
    html = html.replace(searchGrid, questionsHtml + "\\n        " + searchGrid);
} else {
    console.log("Could not find overview grid to insert questions");
}

fs.writeFileSync('projects/traces-together/index.html', html, 'utf8');
console.log("Updated traces-together/index.html");

