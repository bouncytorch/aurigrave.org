import { getPublishedBlogs } from '@/lib/db/blog/internal';
import { getReleases } from '@/lib/db/releases';
import { connection } from 'next/server';

export default async function sitemap() {
    await connection();
    const baseUrl = 'https://aurigrave.org';

    const releases = await getReleases();

    const releaseRoutes = releases.map((release) => ({
        url: `${baseUrl}/audio/release/${release.id}`,
        lastModified: release.release_date || new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
    }));

    const blogs = await getPublishedBlogs();

    const blogRoutes = blogs.map((blog) => ({
        url: `${baseUrl}/blog/${blog.id}`,
        lastModified: blog.updatedAt,
        changeFrequency: 'yearly',
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: `${baseUrl}/audio`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7,
        },
        ...blogRoutes,
        ...releaseRoutes,
    ];
}
