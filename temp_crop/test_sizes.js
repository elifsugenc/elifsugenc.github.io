const { Jimp } = require('jimp');

async function testSizes() {
    const i1 = await Jimp.read('C:/Users/MONSTER/.gemini/antigravity/brain/06376a21-acd9-4cc1-a22b-ebbc53f39571/.user_uploaded/media_1791321473379.png');
    const i2 = await Jimp.read('assets/stray-board-2.jpg');
    console.log(`Board 2 - Uploaded: ${i1.bitmap.width}x${i1.bitmap.height}, Original: ${i2.bitmap.width}x${i2.bitmap.height}`);
    
    const i3 = await Jimp.read('C:/Users/MONSTER/.gemini/antigravity/brain/06376a21-acd9-4cc1-a22b-ebbc53f39571/.user_uploaded/media_1791321598095.png');
    const i4 = await Jimp.read('assets/stray-board-3.jpg');
    console.log(`Board 3 - Uploaded: ${i3.bitmap.width}x${i3.bitmap.height}, Original: ${i4.bitmap.width}x${i4.bitmap.height}`);
}
testSizes();
