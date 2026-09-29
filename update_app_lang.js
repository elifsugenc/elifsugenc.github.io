const fs = require('fs');
let content = fs.readFileSync('assets/app.js', 'utf8');
const oldStr = "document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-lang]').forEach(b=>b.classList.toggle('active',b===button));document.querySelectorAll('[data-en]').forEach(el=>{el.innerHTML=el.dataset[button.dataset.lang]});document.documentElement.lang=button.dataset.lang;}));";

const newStr = "  function setLanguage(lang) {\n" +
"    localStorage.setItem('elifsu-lang', lang);\n" +
"    document.documentElement.lang = lang;\n" +
"    document.querySelectorAll('[data-lang]').forEach(b => {\n" +
"      b.classList.toggle('active', b.dataset.lang === lang);\n" +
"    });\n" +
"    document.querySelectorAll('[data-en]').forEach(el => {\n" +
"      if (el.dataset[lang]) {\n" +
"        el.innerHTML = el.dataset[lang];\n" +
"      }\n" +
"    });\n" +
"  }\n\n" +
"  const savedLang = localStorage.getItem('elifsu-lang') || 'en';\n" +
"  setLanguage(savedLang);\n\n" +
"  document.querySelectorAll('[data-lang]').forEach(button => {\n" +
"    button.addEventListener('click', () => {\n" +
"      setLanguage(button.dataset.lang);\n" +
"    });\n" +
"  });";

if (content.includes(oldStr)) {
    content = content.replace(oldStr, newStr);
    fs.writeFileSync('assets/app.js', content, 'utf8');
    console.log('Updated app.js');
} else {
    console.log('oldStr not found in app.js');
}
