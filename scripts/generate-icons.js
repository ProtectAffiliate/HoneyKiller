/**
 * scripts/generate-icons.js
 *
 * Converts icons/icon.png → icons/icon16.png, icon48.png, icon128.png
 *
 * Usage:
 *   npm install          (installs sharp)
 *   npm run generate-icons
 */

'use strict';

const sharp = require('sharp');
const path  = require('path');

const ROOT    = path.join(__dirname, '..');
const PNG_SRC = path.join(ROOT, 'icons', 'icon.png');
const SIZES   = [16, 48, 128];

async function main() {
  for (const size of SIZES) {
    const outPath = path.join(ROOT, 'icons', `icon${size}.png`);

    await sharp(PNG_SRC)
      .trim()                    // strip white/light border from AI-generated image
      .resize(size, size, { fit: 'cover' })
      .png()
      .toFile(outPath);

    console.log(`  ✓  icon${size}.png`);
  }

  console.log('\nAll icons generated successfully.\n');
}

main().catch(err => {
  console.error('\nIcon generation failed:', err.message);
  process.exit(1);
});
