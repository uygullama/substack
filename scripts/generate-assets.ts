import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const ASSETS_DIR = join(process.cwd(), 'src/assets');
const PUBLIC_DIR = join(process.cwd(), 'public');

function generateAssets() {
  console.log('Generating assets from src/assets...');

  // Ensure public directory exists
  if (!existsSync(PUBLIC_DIR)) {
    mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  const assetMapping = [
    { src: 'favicon.png', dest: 'favicon.ico' }, // using png as ico, browsers support it, or keep as icon.png
    { src: 'favicon.png', dest: 'icon.png' },
    { src: 'lama.png', dest: 'apple-icon.png' },
    { src: 'og-image.png', dest: 'opengraph-image.png' }
  ];

  for (const asset of assetMapping) {
    const srcPath = join(ASSETS_DIR, asset.src);
    const destPath = join(PUBLIC_DIR, asset.dest);

    if (existsSync(srcPath)) {
      copyFileSync(srcPath, destPath);
      console.log(`✅ Copied ${asset.src} to public/${asset.dest}`);
    } else {
      console.warn(`⚠️ Warning: ${asset.src} not found in src/assets.`);
    }
  }

  console.log('Asset generation complete.');
}

generateAssets();
