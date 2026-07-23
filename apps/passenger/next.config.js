/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@smart-bus/shared', '@smart-bus/ui'],
};

module.exports = nextConfig;
