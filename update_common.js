const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('.', function(filePath) {
    if (filePath.endsWith('.html')) {
        let content = fs.readFileSync(filePath, 'utf8');

        const replacements = [
            ['<span class="eyebrow">A CHOICE / 01</span>', '<span class="eyebrow" data-en="A CHOICE / 01" data-tr="BİR SEÇİM / 01">A CHOICE / 01</span>'],
            ['<span class="eyebrow">\n                A CHOICE / 01</span>', '<span class="eyebrow" data-en="A CHOICE / 01" data-tr="BİR SEÇİM / 01">A CHOICE / 01</span>'],
            ['<span class="eyebrow">\r\n                A CHOICE / 01</span>', '<span class="eyebrow" data-en="A CHOICE / 01" data-tr="BİR SEÇİM / 01">A CHOICE / 01</span>'],
            ['<h2 id="consent-title">May this site remember your gestures?</h2>', '<h2 id="consent-title" data-en="May this site remember your gestures?" data-tr="Bu site hareketlerinizi hatırlayabilir mi?">May this site remember your gestures?</h2>'],
            ['<p id="consent-copy">If you agree, your cursor movements will be recorded in the background at regular\n                intervals and added to a collective archive of website interactions. The data will be recorded\n                anonymously; only your cursor activity on this website will be collected.</p>', '<p id="consent-copy" data-en="If you agree, your cursor movements will be recorded in the background at regular intervals and added to a collective archive of website interactions. The data will be recorded anonymously; only your cursor activity on this website will be collected." data-tr="Kabul ederseniz, imleç hareketleriniz düzenli aralıklarla arka planda kaydedilecek ve web sitesi etkileşimlerinin kolektif bir arşivine eklenecektir. Veriler anonim olarak kaydedilecek; yalnızca bu web sitesindeki imleç etkinliğiniz toplanacaktır.">If you agree, your cursor movements will be recorded in the background at regular intervals and added to a collective archive of website interactions. The data will be recorded anonymously; only your cursor activity on this website will be collected.</p>'],
            ['<p id="consent-copy">If you agree, your cursor movements will be recorded in the background at regular\r\n                intervals and added to a collective archive of website interactions. The data will be recorded\r\n                anonymously; only your cursor activity on this website will be collected.</p>', '<p id="consent-copy" data-en="If you agree, your cursor movements will be recorded in the background at regular intervals and added to a collective archive of website interactions. The data will be recorded anonymously; only your cursor activity on this website will be collected." data-tr="Kabul ederseniz, imleç hareketleriniz düzenli aralıklarla arka planda kaydedilecek ve web sitesi etkileşimlerinin kolektif bir arşivine eklenecektir. Veriler anonim olarak kaydedilecek; yalnızca bu web sitesindeki imleç etkinliğiniz toplanacaktır.">If you agree, your cursor movements will be recorded in the background at regular intervals and added to a collective archive of website interactions. The data will be recorded anonymously; only your cursor activity on this website will be collected.</p>'],
            ['<button class="allow" id="allow" type="button">Yes, add my trace\n                    <span>↗</span></button>', '<button class="allow" id="allow" type="button" data-en="Yes, add my trace <span>↗</span>" data-tr="Evet, izimi ekle <span>↗</span>">Yes, add my trace <span>↗</span></button>'],
            ['<button class="allow" id="allow" type="button">Yes, add my trace\r\n                    <span>↗</span></button>', '<button class="allow" id="allow" type="button" data-en="Yes, add my trace <span>↗</span>" data-tr="Evet, izimi ekle <span>↗</span>">Yes, add my trace <span>↗</span></button>'],
            ['<button class="decline" id="decline" type="button">No, just here to\n                    explore</button>', '<button class="decline" id="decline" type="button" data-en="No, just here to explore" data-tr="Hayır, sadece keşfetmek için buradayım">No, just here to explore</button>'],
            ['<button class="decline" id="decline" type="button">No, just here to\r\n                    explore</button>', '<button class="decline" id="decline" type="button" data-en="No, just here to explore" data-tr="Hayır, sadece keşfetmek için buradayım">No, just here to explore</button>'],
            ['<button class="decline" id="decline" type="button">No, just here to explore</button>', '<button class="decline" id="decline" type="button" data-en="No, just here to explore" data-tr="Hayır, sadece keşfetmek için buradayım">No, just here to explore</button>'],
            ['<span>© September 2026</span>', '<span data-en="© September 2026" data-tr="© Eylül 2026">© September 2026</span>'],
            ['<span>A portfolio by Elifsu Genç.</span>', '<span data-en="A portfolio by Elifsu Genç." data-tr="Elifsu Genç portfolyosu.">A portfolio by Elifsu Genç.</span>'],
            ['<span>Last updated September 2026</span>', '<span data-en="Last updated September 2026" data-tr="Son güncelleme Eylül 2026">Last updated September 2026</span>'],
            ['<a href="/">↑ MAIN</a>', '<a href="/" data-en="↑ MAIN" data-tr="↑ ANA SAYFA">↑ MAIN</a>'],
            ['<div class="live" id="live" hidden>● RECORDING · <span id="point-count">0</span> POINTS</div>', '<div class="live" id="live" hidden>● <span data-en="RECORDING" data-tr="KAYDEDİLİYOR">RECORDING</span> · <span id="point-count">0</span> <span data-en="POINTS" data-tr="NOKTA">POINTS</span></div>']
        ];

        for (const [search, replace] of replacements) {
            if (content.includes(search)) {
                content = content.replace(search, replace);
            }
        }

        fs.writeFileSync(filePath, content, 'utf8');
    }
});
