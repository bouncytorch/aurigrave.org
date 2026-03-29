import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [],
        sitemap: 'https://aurigrave.org/sitemap.xml',
        host: 'https://aurigrave.org',
    };
}
