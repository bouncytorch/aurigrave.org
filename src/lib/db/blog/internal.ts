import 'server-only';
import Blog from '@/models/Blog';

export async function getPublishedBlogs() {
    return await Blog.findAll({ where: { state: 'published' } })
        .then(r => r.map(v => v.toJSON()));
}
