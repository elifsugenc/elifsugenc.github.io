const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');
const replacements = [
    ['<h1>elifsu genç<span class="accent">.</span></h1>', '<h1>elifsu genç<span class="accent">.</span></h1>'],
    ['<p>living archive</p>', '<p data-en="living archive" data-tr="yaşayan arşiv">living archive</p>'],
    ['<a class="pill" href="#selected-works">Explore projects <span>↓</span></a>', '<a class="pill" href="#selected-works" data-en="Explore projects <span>↓</span>" data-tr="Projeleri keşfet <span>↓</span>">Explore projects <span>↓</span></a>'],
    ['<span class="eyebrow">01 / SELECTED WORK</span>', '<span class="eyebrow" data-en="01 / SELECTED WORK" data-tr="01 / SEÇİLMİŞ İŞLER">01 / SELECTED WORK</span>'],
    ['<h2>Selected works<span class="accent">.</span></h2>', '<h2 data-en="Selected works<span class=\'accent\'>.</span>" data-tr="Seçilmiş işler<span class=\'accent\'>.</span>">Selected works<span class="accent">.</span></h2>'],
    ['<div class="project-meta"><span>PROJECT</span><span>01</span></div>', '<div class="project-meta"><span data-en="PROJECT" data-tr="PROJE">PROJECT</span><span>01</span></div>'],
    ['<div class="project-meta"><span>PROJECT</span><span>02</span></div>', '<div class="project-meta"><span data-en="PROJECT" data-tr="PROJE">PROJECT</span><span>02</span></div>'],
    ['<div class="project-meta"><span>PROJECT</span><span>03</span></div>', '<div class="project-meta"><span data-en="PROJECT" data-tr="PROJE">PROJECT</span><span>03</span></div>'],
    ['<div class="project-meta"><span>PROJECT</span><span>04</span></div>', '<div class="project-meta"><span data-en="PROJECT" data-tr="PROJE">PROJECT</span><span>04</span></div>'],
    ['<h3>Emek Museum<span class="accent">.</span> <span>↗</span></h3>', '<h3 data-en="Emek Museum<span class=\'accent\'>.</span> <span>↗</span>" data-tr="Emek Müzesi<span class=\'accent\'>.</span> <span>↗</span>">Emek Museum<span class="accent">.</span> <span>↗</span></h3>'],
    ['<span class="eyebrow">02 / COLLECTIVE ARCHIVE</span>', '<span class="eyebrow" data-en="02 / COLLECTIVE ARCHIVE" data-tr="02 / KOLEKTİF ARŞİV">02 / COLLECTIVE ARCHIVE</span>'],
    ['<h2>Traces, together<span class="accent">.</span></h2>', '<h2 data-en="Traces, together<span class=\'accent\'>.</span>" data-tr="İzler, birlikte<span class=\'accent\'>.</span>">Traces, together<span class="accent">.</span></h2>'],
    ['<p>Each visit adds to a visual surface. Quick movements make fine lines; slow movements grow heavier. Stillness pools like ink.</p>', '<p data-en="Each visit adds to a visual surface. Quick movements make fine lines; slow movements grow heavier. Stillness pools like ink." data-tr="Her ziyaret görsel bir yüzeye katkıda bulunur. Hızlı hareketler ince çizgiler çizer; yavaş hareketler kalınlaşır. Hareketsizlik mürekkep gibi birikir.">Each visit adds to a visual surface. Quick movements make fine lines; slow movements grow heavier. Stillness pools like ink.</p>'],
    ['<h3>Individual traces</h3>', '<h3 data-en="Individual traces" data-tr="Bireysel izler">Individual traces</h3>'],
    ['<a class="archive-more" href="/archive/">See more <span aria-hidden="true">↗</span></a>', '<a class="archive-more" href="/archive/" data-en="See more <span aria-hidden=\'true\'>↗</span>" data-tr="Daha fazla gör <span aria-hidden=\'true\'>↗</span>">See more <span aria-hidden="true">↗</span></a>'],
    ['<p class="site-note">Traces are stored on your device. A shared archive is coming soon.</p>', '<p class="site-note" data-en="Traces are stored on your device. A shared archive is coming soon." data-tr="İzler cihazınızda saklanır. Paylaşımlı bir arşiv yakında geliyor.">Traces are stored on your device. A shared archive is coming soon.</p>']
];

for (const [search, replace] of replacements) {
    if (content.includes(search)) {
        content = content.replace(search, replace);
    }
}
fs.writeFileSync('index.html', content, 'utf8');
console.log('Updated index.html');
