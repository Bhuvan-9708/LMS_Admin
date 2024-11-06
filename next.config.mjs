/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  optimizeFonts: false,
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
};

export default nextConfig;
