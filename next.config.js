/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
  reactStrictMode: false,
  // output: "export",
  // distDir:"dist",
  // experimental: {
  //   appDir: true,
  // },

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
