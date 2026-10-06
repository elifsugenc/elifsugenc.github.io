const fs = require('fs');
let html = fs.readFileSync('projects/bio-decay/index.html', 'utf8');

// We will find the exact first paragraph of the detail section and replace it.
const searchStr = `<p class="detail-body" style="font-size: clamp(1.2rem, 3vw, 1.6rem); line-height: 1.4; color: var(--primary); font-weight: 500;" data-en="Bio-decay began with a video titled “How Many Microplastics Can I Eat in a Day?” in which someone attempted to estimate their daily exposure to microplastics through everyday products and food. It made me question the invisible materials we encounter through ordinary acts of consumption." data-tr="Bio-decay, birinin günlük ürünler ve yiyecekler aracılığıyla mikroplastiklere maruz kalma miktarını tahmin etmeye çalıştığı “Bir Günde Kaç Mikroplastik Yiyebilirim?” başlıklı bir video ile başladı. Bu video, sıradan tüketim eylemleri aracılığıyla karşılaştığımız görünmez materyalleri sorgulamamı sağladı.">Bio-decay began with a video titled “How Many Microplastics Can I Eat in a Day?” in which someone attempted to estimate their daily exposure to microplastics through everyday products and food. It made me question the invisible materials we encounter through ordinary acts of consumption.</p>`;

const enText = "Bio-decay began with a YouTube video I watched on a random day titled “How Many Microplastics Can I Eat in a Day?”, where someone attempted to estimate their daily exposure to microplastics through everyday products and food. It made me question the invisible materials we encounter through ordinary acts of consumption.";
const trText = "Bio-decay, sıradan bir günde YouTube'da izlediğim “Bir Günde Kaç Mikroplastik Yiyebilirim?” başlıklı bir video ile başladı. Birinin günlük ürünler ve yiyecekler aracılığıyla mikroplastiklere maruz kalma miktarını tahmin etmeye çalıştığı bu video, basit tüketim eylemleri aracılığıyla karşılaştığımız görünmez materyalleri sorgulamamı sağladı.";

const replaceStr = `<p class="detail-body" style="font-size: clamp(1.2rem, 3vw, 1.6rem); line-height: 1.4; color: var(--primary); font-weight: 500;" data-en="${enText}" data-tr="${trText}">${enText}</p>`;

if (html.includes(searchStr)) {
    html = html.replace(searchStr, replaceStr);
    fs.writeFileSync('projects/bio-decay/index.html', html, 'utf8');
    console.log("Updated first paragraph");
} else {
    console.log("Could not find the paragraph");
}

