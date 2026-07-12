import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@smart-bus/shared', '@smart-bus/ui', '@smart-bus/config'],
};

export default nextConfig;