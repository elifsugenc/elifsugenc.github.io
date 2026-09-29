import os
import re

html_files = []
for root, dirs, files in os.walk(r"D:\000 - WEBSITE\elifsugenc-portfolio-september2026\elifsugenc.github.io"):
    for file in files:
        if file.endswith(".html"):
            html_files.append(os.path.join(root, file))

replacements = [
    (r'<span class="eyebrow">A\s+CHOICE / 01</span>', r'<span class="eyebrow" data-en="A CHOICE / 01" data-tr="BİR SEÇİM / 01">A CHOICE / 01</span>'),
    (r'<h2 id="consent-title">May this site remember your gestures\?</h2>', r'<h2 id="consent-title" data-en="May this site remember your gestures?" data-tr="Bu site hareketlerinizi hatırlayabilir mi?">May this site remember your gestures?</h2>'),
    (r'<p id="consent-copy">If you agree, your cursor movements will be recorded in the background at regular\s+intervals and added to a collective archive of website interactions\. The data will be recorded\s+anonymously; only your cursor activity on this website will be collected\.</p>', r'<p id="consent-copy" data-en="If you agree, your cursor movements will be recorded in the background at regular intervals and added to a collective archive of website interactions. The data will be recorded anonymously; only your cursor activity on this website will be collected." data-tr="Kabul ederseniz, imleç hareketleriniz düzenli aralıklarla arka planda kaydedilecek ve web sitesi etkileşimlerinin kolektif bir arşivine eklenecektir. Veriler anonim olarak kaydedilecek; yalnızca bu web sitesindeki imleç etkinliğiniz toplanacaktır.">If you agree, your cursor movements will be recorded in the background at regular intervals and added to a collective archive of website interactions. The data will be recorded anonymously; only your cursor activity on this website will be collected.</p>'),
    (r'<button class="allow" id="allow" type="button">Yes, add my trace\s*<span>↗</span></button>', r'<button class="allow" id="allow" type="button" data-en="Yes, add my trace <span>↗</span>" data-tr="Evet, izimi ekle <span>↗</span>">Yes, add my trace <span>↗</span></button>'),
    (r'<button class="decline" id="decline" type="button">No, just here to\s*explore</button>', r'<button class="decline" id="decline" type="button" data-en="No, just here to explore" data-tr="Hayır, sadece keşfetmek için buradayım">No, just here to explore</button>'),
    (r'<span>© September 2026</span>', r'<span data-en="© September 2026" data-tr="© Eylül 2026">© September 2026</span>'),
    (r'<span>A portfolio by Elifsu Genç\.</span>', r'<span data-en="A portfolio by Elifsu Genç." data-tr="Elifsu Genç portfolyosu.">A portfolio by Elifsu Genç.</span>'),
    (r'<span>Last updated September 2026</span>', r'<span data-en="Last updated September 2026" data-tr="Son güncelleme Eylül 2026">Last updated September 2026</span>'),
    (r'<a href="/">↑ MAIN</a>', r'<a href="/" data-en="↑ MAIN" data-tr="↑ ANA SAYFA">↑ MAIN</a>'),
    (r'<div class="live" id="live" hidden>● RECORDING · <span id="point-count">0</span> POINTS</div>', r'<div class="live" id="live" hidden>● <span data-en="RECORDING" data-tr="KAYDEDİLİYOR">RECORDING</span> · <span id="point-count">0</span> <span data-en="POINTS" data-tr="NOKTA">POINTS</span></div>'),
]

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    orig_content = content
    for pattern, repl in replacements:
        content = re.sub(pattern, repl, content)
        
    if orig_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated common parts in {filepath}")
