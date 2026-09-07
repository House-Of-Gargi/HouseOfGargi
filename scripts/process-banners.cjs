const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../public/images/banner');
const outDir = path.join(__dirname, '../public/images');

const mappings = [
  { src: '21.png', base: 'hero-desktop-1', desc: 'Concept 1 Desktop (Utsav Anand)' },
  { src: '22.png', base: 'hero-mobile-1', desc: 'Concept 1 Mobile (Utsav Anand)' },
  { src: '23.png', base: 'hero-desktop-2', desc: 'Concept 2 Desktop (Shwet-Raktam)' },
  { src: '24.png', base: 'hero-mobile-2', desc: 'Concept 2 Mobile (Shwet-Raktam)' },
  { src: '25.png', base: 'hero-desktop-3', desc: 'Concept 3 Desktop (Raj-Darbar)' },
  { src: '26.png', base: 'hero-mobile-3', desc: 'Concept 3 Mobile (Raj-Darbar)' },
];

async function processImages() {
  for (const item of mappings) {
    const srcPath = path.join(srcDir, item.src);
    if (!fs.existsSync(srcPath)) {
      console.log('Missing:', srcPath);
      continue;
    }

    const webpOut = path.join(outDir, item.base + '.webp');
    const jpgOut = path.join(outDir, item.base + '.jpg');

    // Generate WebP with high quality
    await sharp(srcPath)
      .webp({ quality: 90, effort: 6 })
      .toFile(webpOut);

    // Generate JPG fallback
    await sharp(srcPath)
      .jpeg({ quality: 90, progressive: true })
      .toFile(jpgOut);

    const webpStat = fs.statSync(webpOut);
    const jpgStat = fs.statSync(jpgOut);

    console.log('Processed ' + item.desc + ':');
    console.log('  -> ' + item.base + '.webp (' + (webpStat.size / 1024).toFixed(1) + ' KB)');
    console.log('  -> ' + item.base + '.jpg (' + (jpgStat.size / 1024).toFixed(1) + ' KB)');
  }
}

processImages().catch(err => {
  console.error('Error processing images:', err);
  process.exit(1);
});
