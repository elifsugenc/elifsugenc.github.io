const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

const startTag = '<div class="project-grid">';
const endTag = '</section>';
const start = content.indexOf(startTag);
const end = content.indexOf(endTag, start);

const newHTML = '<div class="project-bars">' +
    '<a class="project-bar" href="/projects/emek-museum/">' +
        '<div class="pb-marquee">' +
            '<span data-en="How to make invisible labor visible? — How to make invisible labor visible? — How to make invisible labor visible? — " data-tr="Görünmez emek nasıl görünür kılınır? — Görünmez emek nasıl görünür kılınır? — Görünmez emek nasıl görünür kılınır? — ">How to make invisible labor visible? — How to make invisible labor visible? — How to make invisible labor visible? — </span>' +
            '<span data-en="How to make invisible labor visible? — How to make invisible labor visible? — How to make invisible labor visible? — " data-tr="Görünmez emek nasıl görünür kılınır? — Görünmez emek nasıl görünür kılınır? — Görünmez emek nasıl görünür kılınır? — ">How to make invisible labor visible? — How to make invisible labor visible? — How to make invisible labor visible? — </span>' +
        '</div>' +
        '<div class="pb-curtain">' +
            '<div class="pb-title">Emek Museum</div>' +
        '</div>' +
    '</a>' +
    '<a class="project-bar" href="/projects/stray/">' +
        '<div class="pb-marquee">' +
            '<span data-en="Is doing nothing doing something? — Is doing nothing doing something? — Is doing nothing doing something? — " data-tr="Hiçbir şey yapmamak bir şey yapmak mıdır? — Hiçbir şey yapmamak bir şey yapmak mıdır? — Hiçbir şey yapmamak bir şey yapmak mıdır? — ">Is doing nothing doing something? — Is doing nothing doing something? — Is doing nothing doing something? — </span>' +
            '<span data-en="Is doing nothing doing something? — Is doing nothing doing something? — Is doing nothing doing something? — " data-tr="Hiçbir şey yapmamak bir şey yapmak mıdır? — Hiçbir şey yapmamak bir şey yapmak mıdır? — Hiçbir şey yapmamak bir şey yapmak mıdır? — ">Is doing nothing doing something? — Is doing nothing doing something? — Is doing nothing doing something? — </span>' +
        '</div>' +
        '<div class="pb-curtain">' +
            '<div class="pb-title">STRAY</div>' +
        '</div>' +
    '</a>' +
    '<a class="project-bar" href="/projects/bio-decay/">' +
        '<div class="pb-marquee">' +
            '<span data-en="How many microplastics can we eat in a day? — How many microplastics can we eat in a day? — " data-tr="Günde kaç mikroplastik yiyebiliriz? — Günde kaç mikroplastik yiyebiliriz? — Günde kaç mikroplastik yiyebiliriz? — ">How many microplastics can we eat in a day? — How many microplastics can we eat in a day? — </span>' +
            '<span data-en="How many microplastics can we eat in a day? — How many microplastics can we eat in a day? — " data-tr="Günde kaç mikroplastik yiyebiliriz? — Günde kaç mikroplastik yiyebiliriz? — Günde kaç mikroplastik yiyebiliriz? — ">How many microplastics can we eat in a day? — How many microplastics can we eat in a day? — </span>' +
        '</div>' +
        '<div class="pb-curtain">' +
            '<div class="pb-title">Bio-Decay</div>' +
        '</div>' +
    '</a>' +
    '<a class="project-bar" href="/projects/the-earthen/">' +
        '<div class="pb-marquee">' +
            '<span data-en="Does death exist because life exists, or does life exist because death exists? — " data-tr="Hayat var olduğu için mi ölüm var, yoksa ölüm var olduğu için mi hayat var? — Hayat var olduğu için mi ölüm var, yoksa ölüm var olduğu için mi hayat var? — ">Does death exist because life exists, or does life exist because death exists? — </span>' +
            '<span data-en="Does death exist because life exists, or does life exist because death exists? — " data-tr="Hayat var olduğu için mi ölüm var, yoksa ölüm var olduğu için mi hayat var? — Hayat var olduğu için mi ölüm var, yoksa ölüm var olduğu için mi hayat var? — ">Does death exist because life exists, or does life exist because death exists? — </span>' +
        '</div>' +
        '<div class="pb-curtain">' +
            '<div class="pb-title">The Earthen</div>' +
        '</div>' +
    '</a>' +
'</div>\n';

content = content.substring(0, start) + newHTML + content.substring(end);
fs.writeFileSync('index.html', content, 'utf8');
console.log('done');
