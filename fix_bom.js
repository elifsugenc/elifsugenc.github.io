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
        
        // Remove BOM
        if (content.charCodeAt(0) === 0xFEFF) {
            content = content.slice(1);
        }

        const replacements = [
            ['<a class="back-link" href="/projects/">← All projects</a>', '<a class="back-link" href="/projects/" data-en="← All projects" data-tr="← Tüm projeler">← All projects</a>'],
            ['<span class="eyebrow">PROJECT</span>', '<span class="eyebrow" data-en="PROJECT" data-tr="PROJE">PROJECT</span>'],
            ['<p class="detail-body detail-pending">More from this project soon.</p>', '<p class="detail-body detail-pending" data-en="More from this project soon." data-tr="Bu projeden daha fazlası yakında.">More from this project soon.</p>'],
            ['<span>© 2026 elifsu genç</span>', '<span data-en="© 2026 elifsu genç" data-tr="© 2026 elifsu genç">© 2026 elifsu genç</span>'],
            ['<button class="decline" id="decline" type="button">No, just explore</button>', '<button class="decline" id="decline" type="button" data-en="No, just explore" data-tr="Hayır, sadece keşfet">No, just explore</button>'],
            ['<p id="consent-copy">If you agree, cursor positions, pauses and clicks are saved only in this browser during your visit. This GitHub Pages edition cannot add them to the shared public archive. Reload or close the page to end this visit.</p>', '<p id="consent-copy" data-en="If you agree, cursor positions, pauses and clicks are saved only in this browser during your visit. This GitHub Pages edition cannot add them to the shared public archive. Reload or close the page to end this visit." data-tr="Kabul ederseniz, imleç konumları, duraklamalar ve tıklamalar ziyaretiniz boyunca yalnızca bu tarayıcıda kaydedilir. Bu GitHub Pages sürümü bunları paylaşılan genel arşive ekleyemez. Ziyareti sonlandırmak için sayfayı yeniden yükleyin veya kapatın.">If you agree, cursor positions, pauses and clicks are saved only in this browser during your visit. This GitHub Pages edition cannot add them to the shared public archive. Reload or close the page to end this visit.</p>']
        ];

        for (const [search, replace] of replacements) {
            if (content.includes(search)) {
                content = content.replace(search, replace);
            }
        }

        fs.writeFileSync(filePath, content, 'utf8');
    }
});
console.log('Fixed BOM and updated project pages.');
