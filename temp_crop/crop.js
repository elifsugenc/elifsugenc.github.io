const { Jimp } = require('jimp');

async function processImage(annotatedPath, originalPath, outPrefix) {
    const annotImg = await Jimp.read(annotatedPath);
    const origImg = await Jimp.read(originalPath);
    
    const w_annot = annotImg.bitmap.width;
    const h_annot = annotImg.bitmap.height;
    
    const w_orig = origImg.bitmap.width;
    const h_orig = origImg.bitmap.height;
    
    const rx = w_orig / w_annot;
    const ry = h_orig / h_annot;
    
    const visited = new Uint8Array(w_annot * h_annot);
    
    const isYellow = (x, y) => {
        const hex = annotImg.getPixelColor(x, y);
        // hex is RGBA
        const r = (hex >>> 24) & 0xFF;
        const g = (hex >>> 16) & 0xFF;
        const b = (hex >>> 8) & 0xFF;
        return r > 200 && g > 200 && b < 100;
    };

    const boxes = [];

    for (let y = 0; y < h_annot; y += 5) {
        for (let x = 0; x < w_annot; x += 5) {
            const idx = y * w_annot + x;
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
                    
                    const neighbors = [[cx-5, cy], [cx+5, cy], [cx, cy-5], [cx, cy+5]];
                    for (const [nx, ny] of neighbors) {
                        if (nx >= 0 && nx < w_annot && ny >= 0 && ny < h_annot) {
                            const nIdx = ny * w_annot + nx;
                            if (!visited[nIdx]) {
                                visited[nIdx] = 1;
                                if (isYellow(nx, ny)) {
                                    queue.push([nx, ny]);
                                }
                            }
                        }
                    }
                }
                
                if (maxX - minX > 30 && maxY - minY > 30) {
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
                if (b1.x < b2.x + b2.w + 50 && b1.x + b1.w + 50 > b2.x &&
                    b1.y < b2.y + b2.h + 50 && b1.y + b1.h + 50 > b2.y) {
                    
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
    
    console.log(`Found ${boxes.length} regions in ${outPrefix}`);
    
    for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i];
        
        // Shrink the box slightly to exclude the yellow marker
        const shrink = 5; 
        const finalX = Math.max(0, b.x + shrink);
        const finalY = Math.max(0, b.y + shrink);
        const finalW = Math.max(10, b.w - shrink * 2);
        const finalH = Math.max(10, b.h - shrink * 2);
        
        // Scale to original
        const origX = Math.floor(finalX * rx);
        const origY = Math.floor(finalY * ry);
        const origW = Math.floor(finalW * rx);
        const origH = Math.floor(finalH * ry);
        
        console.log(`Cropping ${origW}x${origH} at ${origX},${origY}`);
        
        const cropImg = origImg.clone();
        cropImg.crop({x: origX, y: origY, w: origW, h: origH});
        await cropImg.write(`assets/${outPrefix}_crop_${i+1}.jpg`);
    }
}

async function run() {
    await processImage('C:/Users/MONSTER/.gemini/antigravity/brain/06376a21-acd9-4cc1-a22b-ebbc53f39571/.user_uploaded/media_1791321473379.png', 'assets/stray-board-2.jpg', 'stray_b2');
    await processImage('C:/Users/MONSTER/.gemini/antigravity/brain/06376a21-acd9-4cc1-a22b-ebbc53f39571/.user_uploaded/media_1791321598095.png', 'assets/stray-board-3.jpg', 'stray_b3');
}
run();
