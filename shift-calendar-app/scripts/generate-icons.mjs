import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

const svgContent = readFileSync(join(publicDir, 'icon.svg'), 'utf8');
const svgBuffer = Buffer.from(svgContent);

const sizes = [192, 512];

for (const size of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(join(publicDir, `icon-${size}.png`));
  console.log(`Generated icon-${size}.png`);
}

console.log('Done!');
