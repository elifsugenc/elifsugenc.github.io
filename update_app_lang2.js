const fs = require('fs');
let content = fs.readFileSync('assets/app.js', 'utf8');

const oldStr = "  function setLanguage(lang) {\n" +
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

const newStr = "  function setLanguage(lang) {\n" +
"    try { localStorage.setItem('elifsu-lang', lang); } catch (e) {}\n" +
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
"  let savedLang = 'en';\n" +
"  try { savedLang = localStorage.getItem('elifsu-lang') || 'en'; } catch (e) {}\n" +
"  setLanguage(savedLang);\n\n" +
"  document.querySelectorAll('[data-lang]').forEach(button => {\n" +
"    button.addEventListener('click', () => {\n" +
"      setLanguage(button.dataset.lang);\n" +
"    });\n" +
"  });";

if (content.includes(oldStr)) {
    content = content.replace(oldStr, newStr);
    fs.writeFileSync('assets/app.js', content, 'utf8');
    console.log('Added try/catch to app.js localStorage');
} else {
    console.log('oldStr not found, maybe it was already updated or formatting changed.');
}
