import Blog from '@/models/Blog';
import { cacheLife, cacheTag } from 'next/cache';
import { Op, QueryTypes } from 'sequelize';
import sequelize from '@/lib/db';

const CACHE = (isDev = process.env.NODE_ENV === 'development') =>
    isDev ? cacheLife('seconds') : cacheLife('hours');

export async function getPublishedBlogs() {
    'use cache';
    cacheTag('blogs');
    CACHE();
    return await Blog.findAll({ where: { state: 'published' } })
        .then(r => r.map(v => v.toJSON()));
}

export async function getPublishedBlogsByTag(tag: string) {
    'use cache';
    cacheTag('blogs', `blog-tag:${tag}`);
    CACHE();
    return await Blog.findAll({
        where: { state: 'published', tags: { [Op.contains]: [tag] } },
    }).then(r => r.map(v => v.toJSON()));
}

export async function getPublicBlog(id: string) {
    'use cache';
    cacheTag('blogs', `blog:${id}`);
    CACHE();
    return await Blog.findOne({ where: { id, state: ['published', 'unlisted'] } })
        .then(r => r?.toJSON() ?? null);
}

export async function getAvailableTags(): Promise<string[]> {
    'use cache';
    cacheTag('blog-tags');
    CACHE();
    return await sequelize.query<{ tag: string }>(
        'SELECT tag FROM unique_blog_tags ORDER BY tag',
        { type: QueryTypes.SELECT },
    ).then(r => r.map(v => v.tag));
}

export async function searchPublishedBlogs(term: string, limit = 20, offset = 0) {
    'use cache';
    cacheTag('blogs');
    cacheLife('minutes');           // shorter TTL — inputs are unbounded
    return await sequelize.query<{ id: string; title: string; description: string; rank: number }>(
        `SELECT id, title, description,
                ts_rank(search_vector, websearch_to_tsquery('english', :term)) AS rank
         FROM   "blogs"
         WHERE  search_vector @@ websearch_to_tsquery('english', :term)
           AND  state = 'published'
         ORDER  BY rank DESC, "createdAt" DESC
         LIMIT  :limit OFFSET :offset`,
        { replacements: { term, limit, offset }, type: QueryTypes.SELECT },
    );
}
