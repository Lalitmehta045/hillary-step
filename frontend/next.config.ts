import type { NextConfig } from "next";

/**
 * Resolve the Render (or local) backend origin for same-origin API proxying.
 * Prefer API_PROXY_TARGET; fall back to NEXT_PUBLIC_API_URL without /api/v1.
 */
function resolveBackendOrigin(): string {
  if (process.env.API_PROXY_TARGET) {
    return process.env.API_PROXY_TARGET.replace(/\/$/, "");
  }

  const publicApi = process.env.NEXT_PUBLIC_API_URL;
  if (publicApi) {
    return publicApi.replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");
  }

  return "https://hillary-step.onrender.com";
}

const backendOrigin = resolveBackendOrigin();

const nextConfig: NextConfig = {
  images: {
    // Enable modern image formats for smaller file sizes and faster decoding
    formats: ["image/avif", "image/webp"],
    // Optimize device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
