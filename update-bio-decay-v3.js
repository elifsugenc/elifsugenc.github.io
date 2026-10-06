const fs = require('fs');
let html = fs.readFileSync('projects/bio-decay/index.html', 'utf8');

const searchRegex = /<p class="detail-body" style="font-size: clamp[^>]*>Bio-decay began with a YouTube video I watched on a random day[^<]*<\/p>\s*<p class="detail-body" style="margin-top: 20px;"[^>]*>That curiosity became the starting point[^<]*<\/p>/;

const enP1 = "BIO-DECAY began with a YouTube video titled “How Many Microplastics Can I Eat in a Day?” Made for entertainment, it followed someone attempting to estimate the microplastics in what they consumed, deliberately trying to maximise their intake. The unusual premise caught my attention and made me curious about the invisible materials embedded in everyday consumption.";
const trP1 = "BIO-DECAY, “Bir Günde Kaç Mikroplastik Yiyebilirim?” başlıklı bir YouTube videosuyla başladı. Eğlence amaçlı çekilen bu video, birinin tükettiği mikroplastikleri tahmin etmeye çalışmasını ve bilinçli olarak mikroplastik alımını en üst düzeye çıkarmaya çabalamasını konu alıyordu. Bu sıra dışı çıkış noktası dikkatimi çekti ve beni gündelik tüketim alışkanlıklarımızın içine gizlenmiş görünmez materyalleri sorgulamaya itti.";

const enP2 = "This curiosity developed into a spatial investigation of food waste, bioplastic production, and material decay. BIO-DECAY proposes a living archive where bioplastics made from local food waste gradually transform, recording the effects of time, environmental conditions, and human contact.";
const trP2 = "Bu merak; gıda atıkları, biyoplastik üretimi ve materyal bozunması üzerine mekansal bir araştırmaya dönüştü. BIO-DECAY, yerel gıda atıklarından elde edilen biyoplastiklerin kademeli olarak dönüşüme uğradığı, zamanın, çevresel koşulların ve insan temasının etkilerini kaydeden yaşayan bir arşiv önerisinde bulunuyor.";

const replaceStr = `<p class="detail-body" style="font-size: clamp(1.2rem, 3vw, 1.6rem); line-height: 1.4; color: var(--primary); font-weight: 500;" data-en="${enP1}" data-tr="${trP1}">${enP1}</p>
    
    <p class="detail-body" style="margin-top: 20px;" data-en="${enP2}" data-tr="${trP2}">${enP2}</p>`;

if (html.match(searchRegex)) {
    html = html.replace(searchRegex, replaceStr);
    fs.writeFileSync('projects/bio-decay/index.html', html, 'utf8');
    console.log("Updated both paragraphs successfully");
} else {
    console.log("Could not find the paragraphs to replace");
}

