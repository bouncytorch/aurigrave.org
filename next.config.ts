import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'files.aurigrave.org',
        port: '',
        pathname: '/bouncytorch/**',
      },
    ],
  }
};

export default nextConfig;
