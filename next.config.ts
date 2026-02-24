import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    cacheComponents: true,
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
    serverExternalPackages: ['sequelize', 'pg']
};

export default nextConfig;
