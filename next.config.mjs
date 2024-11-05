/** @type {import('next').NextConfig} */
const nextConfig = {
  // For Static Export
  output: 'export',
  trailingSlash: true,
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
