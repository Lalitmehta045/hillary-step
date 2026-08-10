import { LAND_MASK_B64, LAND_W, LAND_H } from "@/lib/land-mask";

let maskBytes: Uint8Array | null = null;

function mask(): Uint8Array {
  if (maskBytes) return maskBytes;
  const bin = atob(LAND_MASK_B64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  maskBytes = out;
  return out;
}

/** lat in [-90,90], lon in [-180,180] */
export function isLand(lat: number, lon: number): boolean {
  const m = mask();
  const x = Math.min(LAND_W - 1, Math.max(0, Math.floor(((lon + 180) / 360) * LAND_W)));
  const y = Math.min(LAND_H - 1, Math.max(0, Math.floor(((90 - lat) / 180) * LAND_H)));
  const bit = y * LAND_W + x;
  // PIL packs bits MSB-first per row-byte
  return ((m[bit >> 3] ?? 0) & (128 >> (bit & 7))) !== 0;
}

export type Vec3 = { x: number; y: number; z: number };

export function toVec(lat: number, lon: number): Vec3 {
  const p = (lat * Math.PI) / 180;
  const l = (lon * Math.PI) / 180;
  return {
    x: Math.cos(p) * Math.sin(l),
    y: Math.sin(p),
    z: Math.cos(p) * Math.cos(l),
  };
}

export function slerp(a: Vec3, b: Vec3, t: number): Vec3 {
  const dot = Math.min(1, Math.max(-1, a.x * b.x + a.y * b.y + a.z * b.z));
  const omega = Math.acos(dot);
  if (omega < 1e-6) return a;
  const s = Math.sin(omega);
  const k0 = Math.sin((1 - t) * omega) / s;
  const k1 = Math.sin(t * omega) / s;
  return {
    x: a.x * k0 + b.x * k1,
    y: a.y * k0 + b.y * k1,
    z: a.z * k0 + b.z * k1,
  };
}

/** Evenly distributed points on a sphere, filtered to landmasses. */
export function landPoints(count: number): Vec3[] {
  const pts: Vec3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    const lat = (Math.asin(y) * 180) / Math.PI;
    const lon = (Math.atan2(x, z) * 180) / Math.PI;
    if (lat < -60) continue; // trim antarctica like the reference
    if (isLand(lat, lon)) pts.push({ x, y, z });
  }
  return pts;
}
