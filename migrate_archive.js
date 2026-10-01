const fs = require('fs');

const strayHTML = fs.readFileSync('projects/stray/index.html', 'utf8');
const archiveHTML = fs.readFileSync('archive/index.html', 'utf8');

// 1. Extract the `<main>` and other standard layout parts from Stray.
// Actually, it's easier to just build the new HTML from scratch using Stray's template.
// I'll grab Stray's `<head>`, `<header>`, `<footer>` and the scripts.

const headMatch = strayHTML.match(/<head>[\s\S]*?<\/head>/)[0].replace('<title>STRAY — elifsu genç</title>', '<title>Traces Together — elifsu genç</title>');
const headerMatch = strayHTML.match(/<header class="top">[\s\S]*?<\/header>/)[0];
const footerMatch = strayHTML.match(/<footer>[\s\S]*?<\/footer>/)[0];
const endScriptsMatch = strayHTML.match(/<div class="consent-backdrop"[\s\S]*?<\/html>/)[0]; // We just need the consent, live, app.js, and we don't need stray's specific scripts.
const commonEnd = `
    <div class="trace-modal-backdrop" id="trace-modal" hidden>
        <div class="trace-modal-content">
            <header class="trace-modal-header">
                <h2 data-en="All Traces" data-tr="Tüm İzler">All Traces</h2>
                <div class="trace-modal-controls">
                    <select id="trace-sort-select">
                        <option value="newest" data-en="Newest First" data-tr="En Yeniler">Newest First</option>
                        <option value="oldest" data-en="Oldest First" data-tr="En Eskiler">Oldest First</option>
                        <option value="points" data-en="Most Points" data-tr="En Çok Nokta">Most Points</option>
                    </select>
                    <button id="btn-close-trace-modal" class="btn-close-modal">✕</button>
                </div>
            </header>
            <div class="trace-modal-body">
                <div class="grid" id="modal-traces-grid"></div>
            </div>
        </div>
    </div>
    <div class="consent-backdrop" id="consent" hidden><div class="consent" role="dialog" aria-modal="true" aria-labelledby="consent-title"><div class="dialog-language lang-switch" aria-label="Language"><button type="button" data-lang="en">EN</button><span>/</span><button type="button" data-lang="tr">TR</button></div><span class="eyebrow" data-en="A CHOICE / 01" data-tr="BİR SEÇİM / 01">A CHOICE / 01</span><h2 id="consent-title" data-en="May this site remember you?" data-tr="Bu site sizi hatırlayabilir mi?">May this site remember you?</h2><p id="consent-copy" data-en="If you agree, your cursor movements will be recorded in the background at regular intervals and added to a collective archive of website interactions. The data will be recorded anonymously; only your cursor activity on this website will be collected." data-tr="Kabul ederseniz, imleç hareketleriniz düzenli aralıklarla arka planda kaydedilecek ve web sitesi etkileşimlerinin kolektif bir arşivine eklenecektir. Veriler anonim olarak kaydedilecek; yalnızca bu web sitesindeki imleç etkinliğiniz toplanacaktır.">If you agree, your cursor movements will be recorded in the background at regular intervals and added to a collective archive of website interactions. The data will be recorded anonymously; only your cursor activity on this website will be collected.</p><div class="actions"><button class="allow" id="allow" type="button" data-en="Yes, add my trace <span>&#x2197;</span>" data-tr="Evet, izimi ekle <span>&#x2197;</span>">Yes, add my trace <span>&#x2197;</span></button><button class="decline" id="decline" type="button" data-en="No, just here to explore" data-tr="Hayır, sadece keşfetmek için buradayim">No, just here to explore</button></div></div></div>
    <div class="live" id="live" hidden>🔴 <span data-en="RECORDING" data-tr="KAYDEDİLİYOR">RECORDING</span> — <span id="point-count">0</span> <span data-en="POINTS" data-tr="NOKTA">POINTS</span></div>
    <script src="/assets/app.js?v=27" defer></script>
</body>
</html>`;

// Now let's extract sections from archiveHTML
const extractRegex = /<section class="story-section(?: story-step)?">[\s\S]*?<h2><span>(.*?)<\/span>([\s\S]*?)<\/h2>\s*<div class="story-copy">([\s\S]*?)<\/div>(?:<img class="story-diagram" src="(.*?)"[\s\S]*?\/>)?\s*<\/section>/g;

let detailsHtml = '';
let match;
while ((match = extractRegex.exec(archiveHTML)) !== null) {
    const eyebrowNum = match[1];
    const h2Content = match[2];
    const pContent = match[3];
    const imgSrc = match[4];
    
    detailsHtml += `
        <section class="detail-section">
            <div class="detail-heading">
                <span class="eyebrow">${eyebrowNum}</span>
                <h2>${h2Content}</h2>
            </div>
            <div class="detail-body">
                ${pContent.trim()}
                ${imgSrc ? \`<img class="project-image" src="\${imgSrc}" style="margin-top: 20px; width: 100%; border-radius: 4px;" alt="diagram" />\` : ''}
            </div>
        </section>
    `;
}

// Extract the interactive archive part
const allTracesMatch = archiveHTML.match(/<section class="archive archive-list" id="all-traces">([\s\S]*?)<\/section>/);
let allTracesHtml = '';
if (allTracesMatch) {
    allTracesHtml = `
        <section class="detail-section" id="all-traces" style="margin-top: 80px; padding-top: 40px; border-top: 1px solid rgba(23, 23, 23, 0.1);">
            ${allTracesMatch[1]}
        </section>
    `;
}

// Extract header part
// <header class="story-header"><span class="eyebrow" ...>A CASE STUDY</span><h1>...</h1><ul>...</ul></header>
const storyHeaderEyebrow = archiveHTML.match(/<span class="eyebrow"[\s\S]*?>(.*?)<\/span>/)[0]; // just grab the whole tag
const storyHeaderH1 = archiveHTML.match(/<h1>([\s\S]*?)<\/h1>/)[1];
const storyHeaderUl = archiveHTML.match(/<ul>([\s\S]*?)<\/ul>/)[1];

const articleHtml = `
<article>
<div class="project-content" style="padding-top: 120px;">
    <!-- Title / Detail Header -->
    <div class="project-header" style="margin-bottom: 60px;">
        ${storyHeaderEyebrow}
        <h1 class="project-title" style="margin-top: 10px; margin-bottom: 20px; line-height: 1.1;">
            ${storyHeaderH1}
        </h1>
        <ul style="list-style: none; padding: 0; display: flex; gap: 15px; font-size: 0.9rem; color: var(--text-muted); margin-top: 15px;">
            ${storyHeaderUl}
        </ul>
    </div>

    <hr class="project-divider">

    <div class="project-details">
        ${detailsHtml}
        ${allTracesHtml}
    </div>
</div>
</article>
`;

const finalHTML = `<!doctype html>
<html lang="en">
${headMatch}
<body>
    <main>
        ${headerMatch}
        ${articleHtml}
        ${footerMatch}
    </main>
${commonEnd}
`;

fs.mkdirSync('projects/traces-together', { recursive: true });
fs.writeFileSync('projects/traces-together/index.html', finalHTML, 'utf8');
console.log('Created /projects/traces-together/index.html');
