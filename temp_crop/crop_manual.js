const { Jimp } = require('jimp');

async function cropRegions(origFile, scale, regions, outPrefix) {
    const origImg = await Jimp.read(origFile);
    for (let i = 0; i < regions.length; i++) {
        const r = regions[i];
        let x = Math.floor(r.x * scale);
        let y = Math.floor(r.y * scale);
        let w = Math.floor(r.w * scale);
        let h = Math.floor(r.h * scale);
        
        if (x + w > origImg.bitmap.width) w = origImg.bitmap.width - x;
        if (y + h > origImg.bitmap.height) h = origImg.bitmap.height - y;
        
        console.log(`Cropping ${origFile}: ${w}x${h} at ${x},${y}`);
        const cropImg = origImg.clone();
        cropImg.crop({x, y, w, h});
        await cropImg.write(`assets/${outPrefix}_${i+1}.jpg`);
    }
}

async function run() {
    const s2 = 5000 / 1024;
    const s3 = 5000 / 1024;

    const b2_regions = [
        {x: 10, y: 20, w: 235, h: 320},   
        {x: 270, y: 30, w: 140, h: 180},  
        {x: 600, y: 15, w: 150, h: 245},  
        {x: 600, y: 265, w: 150, h: 155}, 
        {x: 10, y: 380, w: 140, h: 190},  
        {x: 260, y: 410, w: 180, h: 170}  
    ];
    
    const b3_regions = [
        {x: 5, y: 330, w: 250, h: 260},    
        {x: 260, y: 410, w: 510, h: 180},  
        {x: 560, y: 230, w: 200, h: 170},  
        {x: 770, y: 150, w: 220, h: 220},  
        {x: 770, y: 380, w: 220, h: 170}   
    ];

    await cropRegions('assets/stray-board-2.jpg', s2, b2_regions, 'stray_crop_b2');
    await cropRegions('assets/stray-board-3.jpg', s3, b3_regions, 'stray_crop_b3');
}
run();
