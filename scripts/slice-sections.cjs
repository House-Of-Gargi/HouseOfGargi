const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function sliceSections() {
  const dir = path.join(__dirname, '..', 'screenshots');

  // Desktop slices (1440 width)
  const desktopPath = path.join(dir, 'desktop-full.png');
  if (fs.existsSync(desktopPath)) {
    // 1. Hero
    await sharp(desktopPath)
      .extract({ left: 0, top: 0, width: 1440, height: 880 })
      .toFile(path.join(dir, 'desktop-01-hero.png'));

    // 2. Categories
    await sharp(desktopPath)
      .extract({ left: 0, top: 880, width: 1440, height: 730 })
      .toFile(path.join(dir, 'desktop-02-categories.png'));

    // 3. Featured
    await sharp(desktopPath)
      .extract({ left: 0, top: 1610, width: 1440, height: 1550 })
      .toFile(path.join(dir, 'desktop-03-featured.png'));

    // 4. Footer
    await sharp(desktopPath)
      .extract({ left: 0, top: 3160, width: 1440, height: 504 })
      .toFile(path.join(dir, 'desktop-04-footer.png'));

    console.log('Desktop sections sliced successfully.');
  }

  // Mobile slices (390 width)
  const mobilePath = path.join(dir, 'mobile-full.png');
  if (fs.existsSync(mobilePath)) {
    // 1. Hero
    await sharp(mobilePath)
      .extract({ left: 0, top: 0, width: 390, height: 700 })
      .toFile(path.join(dir, 'mobile-01-hero.png'));

    // 2. Categories
    await sharp(mobilePath)
      .extract({ left: 0, top: 700, width: 390, height: 790 })
      .toFile(path.join(dir, 'mobile-02-categories.png'));

    // 3. Featured
    await sharp(mobilePath)
      .extract({ left: 0, top: 1490, width: 390, height: 1600 })
      .toFile(path.join(dir, 'mobile-03-featured.png'));

    // 4. Footer
    await sharp(mobilePath)
      .extract({ left: 0, top: 3090, width: 390, height: 995 })
      .toFile(path.join(dir, 'mobile-04-footer.png'));

    console.log('Mobile sections sliced successfully.');
  }
}

sliceSections().catch(console.error);
