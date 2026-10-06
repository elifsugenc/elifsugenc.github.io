const fs = require('fs');
let html = fs.readFileSync('projects/bio-decay/index.html', 'utf8');

const oldSectionRegex = /<span class="eyebrow"[^>]*>01 \/ ABSTRACT & PROJECT STATEMENT<\/span>[\s\S]*?<\/div>\s*<div class="detail-section"/;

const newSectionHtml = `<span class="eyebrow" style="margin-bottom: 15px; display: block;" data-en="01 / PROJECT ORIGIN" data-tr="01 / PROJENIN ÇIKIŞ NOKTASI">01 / PROJECT ORIGIN</span>
    <p class="detail-body" style="font-size: clamp(1.2rem, 3vw, 1.6rem); line-height: 1.4; color: var(--primary); font-weight: 500;" data-en="Bio-decay began with a video titled “How Many Microplastics Can I Eat in a Day?” in which someone attempted to estimate their daily exposure to microplastics through everyday products and food. It made me question the invisible materials we encounter through ordinary acts of consumption." data-tr="Bio-decay, birinin günlük ürünler ve yiyecekler aracılığıyla mikroplastiklere maruz kalma miktarını tahmin etmeye çalıştığı “Bir Günde Kaç Mikroplastik Yiyebilirim?” başlıklı bir video ile başladı. Bu video, sıradan tüketim eylemleri aracılığıyla karşılaştığımız görünmez materyalleri sorgulamamı sağladı.">Bio-decay began with a video titled “How Many Microplastics Can I Eat in a Day?” in which someone attempted to estimate their daily exposure to microplastics through everyday products and food. It made me question the invisible materials we encounter through ordinary acts of consumption.</p>
    
    <p class="detail-body" style="margin-top: 20px;" data-en="That curiosity became the starting point for a spatial investigation into food waste, bioplastic production, and material decay. Could a space make these overlooked processes visible? BIO-DECAY explores this question through a living archive, where bioplastics made from local food waste gradually change, recording the effects of time, environmental conditions, and human contact." data-tr="Bu merak; gıda atıkları, biyoplastik üretimi ve materyal bozunması üzerine mekansal bir araştırmanın başlangıç noktası oldu. Bir mekan bu göz ardı edilen süreçleri görünür kılabilir miydi? BIO-DECAY, bu soruyu, yerel gıda atıklarından üretilen biyoplastiklerin kademeli olarak değiştiği; zamanın, çevresel koşulların ve insan temasının etkilerini kaydeden yaşayan bir arşiv aracılığıyla araştırıyor.">That curiosity became the starting point for a spatial investigation into food waste, bioplastic production, and material decay. Could a space make these overlooked processes visible? BIO-DECAY explores this question through a living archive, where bioplastics made from local food waste gradually change, recording the effects of time, environmental conditions, and human contact.</p>
</div>

<div class="detail-section"`;

html = html.replace(oldSectionRegex, newSectionHtml);

fs.writeFileSync('projects/bio-decay/index.html', html, 'utf8');
console.log("Updated bio-decay introduction");

