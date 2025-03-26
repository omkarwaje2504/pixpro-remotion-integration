/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  distDir:"dist",
  experimental: {
    appDir: true,
  },
  images: {
    domains: [],
  },
};

module.exports = nextConfig;
