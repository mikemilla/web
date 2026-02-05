/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Required for Firebase App Hosting (expects standalone build and routes-manifest)
  output: 'standalone',
  images: { unoptimized: true },
};

module.exports = nextConfig;
