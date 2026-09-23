/**
 * Resolve the Render (or local) backend origin for same-origin API proxying.
 * Prefer API_PROXY_TARGET; fall back to NEXT_PUBLIC_API_URL without /api/v1.
 */
function resolveBackendOrigin() {
  if (process.env.API_PROXY_TARGET) {
    return process.env.API_PROXY_TARGET.replace(/\/$/, "");
  }

  const publicApi = process.env.NEXT_PUBLIC_API_URL;
  if (publicApi) {
    return publicApi.replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");
  }

  return "https://hillarystepsolutions.com";
}

const backendOrigin = resolveBackendOrigin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Enable modern image formats for smaller file sizes and faster decoding
    formats: ["image/avif", "image/webp"],
    // Optimize device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Allow images/assets served from CloudFront CDN
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
        pathname: "/public/hero-video/**",
      },
      {
        protocol: "https",
        hostname: `hillarystepsolutions-storage.s3.ap-south-1.amazonaws.com`,
        pathname: "/public/hero-video/**",
      },
    ],
  },

  // ─── HTTP Cache Headers ────────────────────────────────────────────────────
  // Fixes: site only loads in Incognito (stale cached HTML + JS chunks mismatch)
  async headers() {
    return [
      // ① Next.js static assets (_next/static) → cache 1 year, immutable
      //   These have content-hashed filenames so new deploys always bust cache.
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // ② Public static files (images, fonts, icons) → cache 1 week, revalidate
      {
        source: "/assets/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/:path*.{png,jpg,jpeg,webp,svg,ico,gif,woff,woff2,otf,ttf}",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
        ],
      },
      // ③ HTML pages → NEVER cache (always fetch fresh from server)
      //   This is the KEY fix: prevents stale HTML serving broken JS chunk refs.
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
          // Security headers
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  // Proxy /api/v1 → backend so session cookies are first-party on the Vercel host.
  // Direct cross-origin calls still work via SameSite=None on the backend cookie.
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendOrigin}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
