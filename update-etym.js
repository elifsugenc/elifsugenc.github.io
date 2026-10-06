const fs = require('fs');
let html = fs.readFileSync('projects/bajo-la-fresca/index.html', 'utf8');

// Regex replace
html = html.replace(
  /<p style="font-size: clamp\(1\.2rem, 3vw, 1\.6rem\); line-height: 1\.4; color: var\(--primary\); margin-bottom: 30px; font-weight: 500;" data-en="<em style='color: var\(--fg\);'>bajo la fresca:<\/em><br>A Spanish tradition of sitting outside in the evening to relax and socialize in the cool air." data-tr="<em style='color: var\(--fg\);'>bajo la fresca:<\/em><br>İspanya'da akşamları serin havada rahatlamak ve sosyalleşmek için dışarıda oturma geleneği."><em style="color: var\(--fg\);">bajo la fresca:<\/em><br>A Spanish tradition of sitting outside in the evening to relax and socialize in the cool air.<\/p>/g,
  `<p style="font-size: clamp(1.2rem, 3vw, 1.6rem); line-height: 1.4; color: var(--primary); margin-bottom: 30px; font-weight: 500;" data-en="<em style='color: var(--fg);'>bajo la fresca:</em><br>Derived from a combination of <i>'bajo'</i> (under) and <i>'a la fresca'</i> (in the cool air), it refers to the Spanish tradition of sitting outside in the evening to relax and socialize." data-tr="<em style='color: var(--fg);'>bajo la fresca:</em><br><i>'Bajo'</i> (altında) ve <i>'a la fresca'</i> (serin havada) kelimelerinin birleşiminden türeyen bu isim, İspanya'da akşamları serin havada rahatlamak ve sosyalleşmek için dışarıda oturma geleneğini ifade eder."><em style="color: var(--fg);">bajo la fresca:</em><br>Derived from a combination of <i>'bajo'</i> (under) and <i>'a la fresca'</i> (in the cool air), it refers to the Spanish tradition of sitting outside in the evening to relax and socialize.</p>`
);

fs.writeFileSync('projects/bajo-la-fresca/index.html', html, 'utf8');
console.log("Updated Etymology");

