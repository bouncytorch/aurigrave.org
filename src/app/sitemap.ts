import { MetadataRoute } from 'next';
import { getReleases } from '@/lib/releases';

export default async function sitemap( ): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://aurigrave.org';

    const releases = await getReleases( );

    const releaseRoutes = releases.map((release) => ({
        url: `${baseUrl}/audio/release/${release.id}`,
        lastModified: release.release_date || new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'yearly' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/audio`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/software`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        ...releaseRoutes,
    ];
}
