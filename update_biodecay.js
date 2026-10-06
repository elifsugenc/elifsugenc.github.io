const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

const targetTr = 'Günde kaç mikroplastik yiyebiliriz\\? — Günde kaç mikroplastik yiyebiliriz\\? — Günde kaç mikroplastik yiyebiliriz\\? — ';
const newTr = 'Bir günde en fazla ne kadar mikroplastik yiyebiliriz? — Bir günde en fazla ne kadar mikroplastik yiyebiliriz? — ';

content = content.replace(new RegExp(targetTr, 'g'), newTr);

fs.writeFileSync('index.html', content, 'utf8');
console.log('done');
