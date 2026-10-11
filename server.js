const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.woff2': 'font/woff2',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath.includes('?')) filePath = filePath.split('?')[0];
    if (filePath === './' || filePath.endsWith('/')) filePath += 'index.html';

    const extname = String(path.extname(filePath)).toLowerCase();
    let contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                if (!path.extname(filePath)) {
                    fs.readFile(filePath + '.html', (err, cont) => {
                        if (!err) {
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.end(cont, 'utf-8');
                        } else {
                            fs.readFile(path.join(filePath, 'index.html'), (err2, cont2) => {
                                if (!err2) {
                                    res.writeHead(200, { 'Content-Type': 'text/html' });
                                    res.end(cont2, 'utf-8');
                                } else {
                                    res.writeHead(404);
                                    res.end('404 Not Found');
                                }
                            });
                        }
                    });
                    return;
                }
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
}).listen(PORT, () => {
    console.log('Sunucu calisiyor: http://localhost:' + PORT + '/');
});
