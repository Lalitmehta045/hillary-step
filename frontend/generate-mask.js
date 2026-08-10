const fs = require('fs');
const PImage = require('pureimage');
const d3 = require('d3-geo');
const topojson = require('topojson-client');

async function generate() {
  console.log("Fetching world atlas...");
  const url = 'https://unpkg.com/world-atlas@2.0.2/countries-110m.json';
  const response = await fetch(url);
  const topology = await response.json();
  const land = topojson.feature(topology, topology.objects.land);

  const LAND_W = 1024;
  const LAND_H = 512;

  console.log("Drawing mask...");
  const img = PImage.make(LAND_W, LAND_H);
  const ctx = img.getContext('2d');
  
  // fill black
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, LAND_W, LAND_H);
  
  // draw land white
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  
  // Create an equirectangular projection
  const projection = d3.geoEquirectangular()
    .scale(LAND_W / (2 * Math.PI))
    .translate([LAND_W / 2, LAND_H / 2]);
    
  const path = d3.geoPath().projection(projection).context(ctx);
  path(land);
  ctx.fill();

  console.log("Generating bytes...");
  const bytes = new Uint8Array((LAND_W * LAND_H) / 8);
  
  for (let y = 0; y < LAND_H; y++) {
    for (let x = 0; x < LAND_W; x++) {
      const color = img.getPixelRGBA(x, y);
      const r = (color >>> 24) & 255; // Red channel (PureImage packs as RRGGBBAA)
      
      const isLand = r > 128;
      
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
