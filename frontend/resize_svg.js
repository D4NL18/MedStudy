const sharp = require('sharp');
const fs = require('fs');

const svgPath = 'public/favicon.svg';
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generate() {
    const svgBuffer = fs.readFileSync(svgPath);

    for (const size of sizes) {
        await sharp(svgBuffer)
            .resize(size, size)
            .png()
            .toFile(`public/icons/icon-${size}x${size}.png`);
        console.log(`Created icon-${size}x${size}.png`);
    }

    // favicon.ico (as a 32x32 png, which works fine as .ico for most modern browsers)
    await sharp(svgBuffer)
        .resize(32, 32)
        .png()
        .toFile('public/favicon.ico');
    console.log('Created favicon.ico');
}

generate().catch(console.error);
