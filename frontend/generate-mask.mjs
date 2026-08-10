import fs from 'fs';
import Jimp from 'jimp';

async function generate() {
  console.log("Loading image...");
  // Use a public equirectangular map image
  const img = await Jimp.read('https://upload.wikimedia.org/wikipedia/commons/c/cd/Land_ocean_ice_2048.jpg');
  
  const LAND_W = 1024;
  const LAND_H = 512;
  
  console.log("Processing image...");
  img.resize(LAND_W, LAND_H);
  
  // We need an array of bytes
  const bytes = new Uint8Array((LAND_W * LAND_H) / 8);
  
  for (let y = 0; y < LAND_H; y++) {
    for (let x = 0; x < LAND_W; x++) {
      const color = img.getPixelColor(x, y);
      const rgba = Jimp.intToRGBA(color);
      
      // If it's mostly white (land/ice), treat as land. The map is blue for ocean, white/grey/green for land.
      // Ocean in this map is blue (B > R). Let's use a simple heuristic.
      // Or just check if the pixel is not too blue.
      const isLand = (rgba.r + rgba.g > rgba.b * 1.5) || (rgba.r > 200 && rgba.g > 200 && rgba.b > 200);
      
      if (isLand) {
        const bitIndex = y * LAND_W + x;
        const byteIndex = bitIndex >> 3;
        const bitPosition = 7 - (bitIndex & 7); // MSB-first
        bytes[byteIndex] |= (1 << bitPosition);
      }
    }
  }

  const base64 = Buffer.from(bytes).toString('base64');
  const content = `export const LAND_W = ${LAND_W};
export const LAND_H = ${LAND_H};
export const LAND_MASK_B64 = "${base64}";
`;
  
  fs.writeFileSync('lib/land-mask.ts', content);
  console.log("Done!");
}

generate().catch(console.error);
