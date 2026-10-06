const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

const targetEng = 'Does death exist because life exists, or does life exist because death exists? — ';
const targetTr = 'Hayat var olduğu için mi ölüm var, yoksa ölüm var olduğu için mi hayat var? — Hayat var olduğu için mi ölüm var, yoksa ölüm var olduğu için mi hayat var? — ';
const newEng = 'Is there death because there is life? — Is there death because there is life? — Is there death because there is life? — Is there death because there is life? — ';
const newTr = 'Hayat olduğu için mi ölüm var? — Hayat olduğu için mi ölüm var? — Hayat olduğu için mi ölüm var? — Hayat olduğu için mi ölüm var? — ';

content = content.replace(new RegExp(targetEng, 'g'), newEng);
content = content.replace(new RegExp(targetTr, 'g'), newTr);

fs.writeFileSync('index.html', content, 'utf8');
console.log('done');
