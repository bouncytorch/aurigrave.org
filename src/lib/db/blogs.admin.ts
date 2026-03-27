import Blog, { BlogState } from '@/models/Blog';
import { QueryTypes } from 'sequelize';
import sequelize from '@/lib/db';
import { requireAdmin } from '../auth';

export async function getAllBlogs(state?: BlogState) {
    await requireAdmin();
    return Blog.findAll({
        where: state ? { state } : undefined,
    }).then(r => r.map(v => v.toJSON()));
}

export async function getAnyBlog(id: string) {
    await requireAdmin();
    return Blog.findByPk(id).then(r => r?.toJSON() ?? null);
}

export async function searchAllBlogs(term: string, state?: BlogState) {
    await requireAdmin();
    return sequelize.query(
        `SELECT id, title, description, state, "createdAt",
                ts_rank(search_vector, websearch_to_tsquery('english', :term)) AS rank
         FROM   "blogs"
         WHERE  search_vector @@ websearch_to_tsquery('english', :term)
           ${state ? 'AND state = :state' : ''}
         ORDER  BY rank DESC, "createdAt" DESC`,
        { replacements: { term, ...(state && { state }) }, type: QueryTypes.SELECT },
    );
}
