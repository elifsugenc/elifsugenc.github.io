const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// The original strings inside the span tags for the-earthen
content = content.replace(/data-en="Does death exist because life exists, or does life exist because death exists\? [^"]+"/g, 'data-en="Is there death because there is life? — Is there death because there is life? — Is there death because there is life? — Is there death because there is life? — "');

content = content.replace(/data-tr="Hayat var oldu.*?u i.*?in mi .*?l.*?m var, yoksa .*?l.*?m var oldu.*?u i.*?in mi hayat var\? [^"]+"/g, 'data-tr="Hayat olduğu için mi ölüm var? — Hayat olduğu için mi ölüm var? — Hayat olduğu için mi ölüm var? — Hayat olduğu için mi ölüm var? — "');

content = content.replace(/>Does death exist because life exists, or does life exist because death exists\? [^<]+</g, '>Is there death because there is life? — Is there death because there is life? — Is there death because there is life? — Is there death because there is life? — <');

fs.writeFileSync('index.html', content, 'utf8');
console.log('done');
