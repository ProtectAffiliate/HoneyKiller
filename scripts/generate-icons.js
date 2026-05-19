/**
 * scripts/generate-icons.js
 *
 * Converts icons/icon.svg → icons/icon16.png, icon48.png, icon128.png
 *
 * Usage:
 *   npm install          (installs sharp)
 *   npm run generate-icons
 */

'use strict';

const sharp = require('sharp');
const path  = require('path');
const fs    = require('fs');

const ROOT    = path.join(__dirname, '..');
const SVG_SRC = path.join(ROOT, 'icons', 'icon.svg');
const SIZES   = [16, 48, 128];

async function main() {
  const svg = fs.readFileSync(SVG_SRC);

  for (const size of SIZES) {
    const outPath = path.join(ROOT, 'icons', `icon${size}.png`);

    await sharp(svg)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
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
