/*
Batch image compression script using Sharp.
- Compresses images in src/assets/images and public directories.
- Generates WebP versions and optionally overwrites originals with compressed PNG/JPEG.
Usage (PowerShell):
  node tools/compress-images.js
*/

const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const roots = [
  path.join(__dirname, '..', 'src', 'assets', 'images'),
  path.join(__dirname, '..', 'public'),
];

const MAX_WIDTH = 1920; // cap large hero images
const QUALITY = 70; // compression quality

const exts = new Set(['.png', '.jpg', '.jpeg']);

async function ensureDir(p) {
  await fs.promises.mkdir(p, { recursive: true }).catch(() => {});
}

async function compressFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!exts.has(ext)) return;

  const dir = path.dirname(filePath);
  const base = path.basename(filePath, ext);
  const webpOut = path.join(dir, base + '.webp');

  try {
    const img = sharp(filePath, { limitInputPixels: 268435456 }); // 16384^2
    const meta = await img.metadata();
    const width = meta.width || MAX_WIDTH;
    const targetWidth = Math.min(width, MAX_WIDTH);

    // Generate WebP
    await img
      .resize({ width: targetWidth })
      .webp({ quality: QUALITY })
      .toFile(webpOut);

    // Overwrite original with compressed version (keep format)
    if (ext === '.png') {
      await img
        .resize({ width: targetWidth })
        .png({ quality: QUALITY, compressionLevel: 9 })
        .toFile(filePath + '.compressed');
    } else {
      await img
        .resize({ width: targetWidth })
        .jpeg({ quality: QUALITY })
        .toFile(filePath + '.compressed');
    }

    await fs.promises.rename(filePath + '.compressed', filePath);
    console.log(`Compressed: ${path.relative(process.cwd(), filePath)} | WebP: ${path.relative(process.cwd(), webpOut)}`);
  } catch (err) {
    console.error('Failed:', filePath, err.message);
  }
}

async function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      await walk(full);
    } else {
      await compressFile(full);
    }
  }
}

(async () => {
  for (const r of roots) {
    await walk(r);
  }
  console.log('Image compression complete.');
})();
