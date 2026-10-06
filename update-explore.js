const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(
    /data-en="Explore projects (<span>.*?<\/span>)"\s*data-tr="[^"]*">Explore projects <span>.*?<\/span>/g, 
    'data-en="Selected works $1" data-tr="Seçili işler $1">Selected works $1'
);

fs.writeFileSync('index.html', html, 'utf8');
console.log("Updated explore projects button");
