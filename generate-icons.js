import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputSvgPath = join(__dirname, 'public', 'favicon.svg');
const svgString = readFileSync(inputSvgPath, 'utf8');

const iconConfigs = [
  { name: 'pwa-192.png', size: 192, isMaskable: false },
  { name: 'pwa-512.png', size: 512, isMaskable: false },
  { name: 'pwa-512-maskable.png', size: 512, isMaskable: true }
];

async function generateIcons() {
  console.log('Generating PWA icons from favicon.svg...');

  for (const config of iconConfigs) {
    const outputPath = join(__dirname, 'public', config.name);
    const size = config.size;
    
    // For maskable icon, we remove the border radius from the background rect
    // to ensure it fills the entire safe area and allows Android to apply its own mask.
    let currentSvgString = svgString;
    if (config.isMaskable) {
      currentSvgString = currentSvgString.replace('rx="8"', '');
    }
    
    const svgBuffer = Buffer.from(currentSvgString);
    
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
      
    console.log(`Generated ${config.name} (${size}x${size})`);
  }
  
  console.log('All icons generated successfully!');
}

generateIcons().catch(console.error);
