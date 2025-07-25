/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/ffmpeg/:path*",
        headers: [
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
      {
        source: "/", // ✅ Apply to homepage too
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
        ],
      },
    ];
  },
  reactStrictMode: false,
  output: "export",
  distDir: "dist",
  assetPrefix: "/pixpro-remotion-integration/",
  basePath: "/pixpro-remotion-integration",
  experimental: {
    appDir: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
      {
        protocol: "https",
        hostname: "pixpro.s3.ap-south-1.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
