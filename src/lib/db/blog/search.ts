'use server';

import Blog from '@/models/Blog';
import { Op, QueryTypes } from 'sequelize';
import sequelize from '@/lib/db';

export async function getPublishedBlogsByTag(tag: string, limit = 10, offset = 0) {
    if (limit > 20)
        throw new Error('You may not request more than 20 entries at a time.');
    return await Blog.findAll({
        where: { state: 'published', tags: { [Op.contains]: [tag] } },
        limit, offset
    }).then(r => r.map(v => v.toJSON()));
}

export async function getPublishedBlogs(limit = 10, offset = 0) {
    if (limit > 20)
        throw new Error('You may not request more than 20 entries at a time.');
    return await Blog.findAndCountAll({ where: { state: 'published' }, limit, offset })
        .then(r => ({ rows: r.rows.map(v => v.toJSON()), count: r.count }));
}

export async function getPublicBlog(id: string) {
    return await Blog.findOne({ where: { id, state: ['published', 'unlisted'] } })
        .then(r => r?.toJSON() ?? null);
}

export async function getAvailableTags(): Promise<string[]> {
    return await sequelize.query<{ tag: string }>(
        'SELECT tag FROM unique_blog_tags ORDER BY tag',
        { type: QueryTypes.SELECT },
    ).then(r => r.map(v => v.tag));
}

export async function searchPublishedBlogs(term: string, limit = 10, offset = 0) {
    if (limit > 20)
        throw new Error('You may not request more than 20 entries at a time.');
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
