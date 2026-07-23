import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@smart-bus/shared', '@smart-bus/ui', '@smart-bus/config'],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
