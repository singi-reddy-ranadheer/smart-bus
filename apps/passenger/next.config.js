/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['@smart-bus/shared', '@smart-bus/ui'],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
