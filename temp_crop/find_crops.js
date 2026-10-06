const { Jimp } = require('jimp');
const fs = require('fs');

async function processImage(imagePath) {
    console.log("Processing " + imagePath);
    let img;
    try {
        img = await Jimp.read(imagePath);
    } catch(e) {
        console.error("Jimp load error:", e);
        return;
    }
    const width = img.bitmap.width;
    const height = img.bitmap.height;
    
    const visited = new Uint8Array(width * height);
    
    const isYellow = (x, y) => {
        const hex = img.getPixelColor(x, y);
        const rgba = Jimp.intToRGBA(hex);
        return rgba.r > 200 && rgba.g > 200 && rgba.b < 100;
    };

    const boxes = [];

    for (let y = 0; y < height; y += 10) {
        for (let x = 0; x < width; x += 10) {
            const idx = y * width + x;
            if (!visited[idx] && isYellow(x, y)) {
                let minX = x, maxX = x, minY = y, maxY = y;
                const queue = [[x, y]];
                visited[idx] = 1;
                
                while (queue.length > 0) {
                    const [cx, cy] = queue.shift();
                    
                    if (cx < minX) minX = cx;
                    if (cx > maxX) maxX = cx;
                    if (cy < minY) minY = cy;
                    if (cy > maxY) maxY = cy;
                    
                    const neighbors = [[cx-10, cy], [cx+10, cy], [cx, cy-10], [cx, cy+10]];
                    for (const [nx, ny] of neighbors) {
                        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                            const nIdx = ny * width + nx;
                            if (!visited[nIdx]) {
                                visited[nIdx] = 1;
                                if (isYellow(nx, ny)) {
                                    queue.push([nx, ny]);
                                }
                            }
                        }
                    }
                }
                
                if (maxX - minX > 50 && maxY - minY > 50) {
                    boxes.push({x: minX, y: minY, w: maxX - minX, h: maxY - minY});
                }
            }
        }
    }
    
    let merged = true;
    while(merged) {
        merged = false;
        for (let i = 0; i < boxes.length; i++) {
            for (let j = i + 1; j < boxes.length; j++) {
                const b1 = boxes[i];
                const b2 = boxes[j];
                if (b1.x < b2.x + b2.w + 100 && b1.x + b1.w + 100 > b2.x &&
                    b1.y < b2.y + b2.h + 100 && b1.y + b1.h + 100 > b2.y) {
                    
                    const newMinX = Math.min(b1.x, b2.x);
                    const newMinY = Math.min(b1.y, b2.y);
                    const newMaxX = Math.max(b1.x + b1.w, b2.x + b2.w);
                    const newMaxY = Math.max(b1.y + b1.h, b2.y + b2.h);
                    
                    boxes[i] = { x: newMinX, y: newMinY, w: newMaxX - newMinX, h: newMaxY - newMinY };
                    boxes.splice(j, 1);
                    merged = true;
                    break;
                }
            }
            if(merged) break;
        }
    }
    
    console.log("Found " + boxes.length + " regions.");
    
    for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i];
        console.log("Box: ", b);
    }
}

async function run() {
    await processImage('C:/Users/MONSTER/.gemini/antigravity/brain/06376a21-acd9-4cc1-a22b-ebbc53f39571/.user_uploaded/media_1791321473379.png');
    await processImage('C:/Users/MONSTER/.gemini/antigravity/brain/06376a21-acd9-4cc1-a22b-ebbc53f39571/.user_uploaded/media_1791321598095.png');
}
run();
