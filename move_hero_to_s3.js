/**
 * move_hero_to_s3.js
 * ─────────────────────────────────────────────────────────────────────────────
 * One-time script: uploads hero-video assets from /frontend/public/hero-video/
 * to the existing S3 bucket (hillarystepsolutions-storage) with production-grade
 * cache headers so CloudFront can serve them indefinitely from edge.
 *
 * Usage:
 *   node move_hero_to_s3.js
 *
 * Requirements:
 *   npm install @aws-sdk/client-s3 dotenv  (in root or backend)
 *
 * Env vars read from: ./backend/.env
 * ─────────────────────────────────────────────────────────────────────────────
 */

const path = require("path");
const fs = require("fs");

// Use backend's node_modules — no extra npm install needed at root
const backendModules = path.join(__dirname, "backend", "node_modules");
require(path.join(backendModules, "dotenv")).config({
  path: path.join(__dirname, "backend", ".env"),
});

const { S3Client, PutObjectCommand, HeadObjectCommand } = require(
  path.join(backendModules, "@aws-sdk", "client-s3")
);

// (safeguard stub — no-op)
if (!module.parent) {
  // already loaded above via require('dotenv') — this is just a safeguard
}

// ── Config ────────────────────────────────────────────────────────────────────
const BUCKET = process.env.AWS_S3_BUCKET_NAME;
const REGION = process.env.AWS_REGION;
const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;

if (!BUCKET || !REGION || !ACCESS_KEY || !SECRET_KEY) {
  console.error("❌  Missing AWS env vars. Check backend/.env");
  process.exit(1);
}

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

// ── Files to upload ───────────────────────────────────────────────────────────
const HERO_VIDEO_LOCAL_DIR = path.join(__dirname, "frontend", "public", "hero-video");

const FILES = [
  {
    localName: "CINE V5.mp4",
    s3Key: "public/hero-video/CINE-V5.mp4",      // space-free key for clean URLs
    contentType: "video/mp4",
    cacheControl: "public, max-age=31536000, immutable",
  },
  {
    localName: "cine-v5-mobile.mp4",
    s3Key: "public/hero-video/cine-v5-mobile.mp4",
    contentType: "video/mp4",
    cacheControl: "public, max-age=31536000, immutable",
  },
  {
    localName: "hero-poster.webp",
    s3Key: "public/hero-video/hero-poster.webp",
    contentType: "image/webp",
    cacheControl: "public, max-age=31536000, immutable",
  },
  {
    localName: "hero-poster.jpg",
    s3Key: "public/hero-video/hero-poster.jpg",
    contentType: "image/jpeg",
    cacheControl: "public, max-age=31536000, immutable",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function alreadyExists(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function uploadFile({ localName, s3Key, contentType, cacheControl }) {
  const localPath = path.join(HERO_VIDEO_LOCAL_DIR, localName);

  if (!fs.existsSync(localPath)) {
    console.warn(`  ⚠️  Skipping (not found locally): ${localName}`);
    return;
  }

  const stats = fs.statSync(localPath);
  const sizeLabel = formatBytes(stats.size);

  // Skip if already uploaded (idempotent re-runs)
  const exists = await alreadyExists(s3Key);
  if (exists) {
    console.log(`  ✅ Already on S3 (skipping): ${s3Key}  [${sizeLabel}]`);
    return;
  }

  console.log(`  ⬆️  Uploading ${localName}  →  s3://${BUCKET}/${s3Key}  [${sizeLabel}]`);

  const body = fs.createReadStream(localPath);

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: s3Key,
      Body: body,
      ContentType: contentType,
      CacheControl: cacheControl,
      // NOTE: No ACL — assume bucket policy / CloudFront OAC grants access.
      // If bucket is public, add: ACL: "public-read"
    })
  );

  console.log(`  ✅ Done: s3://${BUCKET}/${s3Key}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n🚀  Hillary Step — Hero Video S3 Upload");
  console.log(`   Bucket : ${BUCKET}`);
  console.log(`   Region : ${REGION}`);
  console.log(`   Files  : ${FILES.length}\n`);

  for (const file of FILES) {
    await uploadFile(file);
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  Upload complete!

Next steps:
  1. AWS Console → CloudFront → Create Distribution
     Origin: ${BUCKET}.s3.${REGION}.amazonaws.com
     Origin Path: (leave blank)
     Viewer Protocol: Redirect HTTP → HTTPS
     Cache Policy: CachingOptimized (or Managed-CachingOptimized)
     Price Class: Use All Edge Locations (or Asia/India for cheapest)

  2. After distribution deploys (~5 min), note the domain:
     e.g.  d1abc2def3.cloudfront.net

  3. Set in frontend/.env.local (and Hostinger env):
     NEXT_PUBLIC_HERO_VIDEO_BASE_URL=https://d1abc2def3.cloudfront.net/public/hero-video

  4. Redeploy frontend — videos will load from CloudFront edge! 🎉
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
}

main().catch((err) => {
  console.error("❌  Upload failed:", err.message || err);
  process.exit(1);
});
