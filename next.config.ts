import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    experimental: {
        serverActions: {
            bodySizeLimit: '30mb'
        }
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'files.aurigrave.org',
                port: '',
                pathname: '/bouncytorch/**',
            },
        ],
    },
    serverExternalPackages: ['sequelize', 'pg', 'canvas']
};

export default nextConfig;
