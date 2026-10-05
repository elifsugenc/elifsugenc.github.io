const fs = require('fs');
const filePath = 'projects/emek-museum/index.html';
let content = fs.readFileSync(filePath, 'utf8');

const target = '<p class="detail-body detail-pending" data-en="More from this project soon." data-tr="Bu projeden daha fazlası yakında.">More from this project soon.</p>';

const para1EN = "Work-related accidents remain a persistent reality, particularly in Türkiye. Yet when workers lose their lives, the public narrative often ends with the accident itself—their labour, the time they gave, and the lives shaped through their work gradually disappear from view.";
const para1TR = "İş kazaları, özellikle Türkiye'de kalıcı bir gerçeklik olmaya devam ediyor. Ancak işçiler hayatlarını kaybettiklerinde, kamusal anlatı genellikle kazanın kendisiyle sona erer—emekleri, verdikleri zaman ve işleri aracılığıyla şekillenen hayatları yavaş yavaş gözden kaybolur.";

const para2EN = "Emek Museum asks: how can we make this labour visible again?";
const para2TR = "Emek Müzesi soruyor: bu emeği nasıl yeniden görünür kılabiliriz?";

const newHTML = '<div class="detail-body"><p style="margin-bottom: 1.5em;" data-en="' + para1EN + '" data-tr="' + para1TR + '">' + para1EN + '</p><p style="margin-bottom: 3em;" data-en="' + para2EN + '" data-tr="' + para2TR + '">' + para2EN + '</p></div><p class="detail-body detail-pending" data-en="More from this project soon." data-tr="Bu projeden daha fazlası yakında.">More from this project soon.</p>';

content = content.replace(target, newHTML);

fs.writeFileSync(filePath, content, 'utf8');
console.log('done');
