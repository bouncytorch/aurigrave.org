import 'server-only';
import Blog from '@/models/Blog';
import { cacheLife, cacheTag } from 'next/cache';

const CACHE = (isDev = process.env.NODE_ENV === 'development') =>
    isDev ? cacheLife('seconds') : cacheLife('hours');

export async function getPublishedBlogs() {
    'use cache';
    cacheTag('blogs');
    CACHE();
    return await Blog.findAll({ where: { state: 'published' } })
        .then(r => r.map(v => v.toJSON()));
}
