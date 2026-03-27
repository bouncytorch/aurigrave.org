'use server';

import Blog, { BlogState, BlogCreationData, BlogData } from '@/models/Blog';
import { revalidateTag } from 'next/cache';
import { requireAdmin } from '@/lib/auth';

function invalidate(id?: string, tags?: string[]) {
    const profile = { expire: 0 };
    revalidateTag('blogs',     profile);
    revalidateTag('blog-tags', profile);
    if (id)   revalidateTag(`blog:${id}`,       profile);
    if (tags) tags.forEach(t => revalidateTag(`blog-tag:${t}`, profile));
}

export async function createBlog(data: Omit<BlogCreationData, 'id'>) {
    await requireAdmin();
    const blog = await Blog.create(data);
    invalidate(blog.id, blog.tags);
    return blog.toJSON();
}

export async function updateBlog(id: string, data: Partial<BlogData>) {
    await requireAdmin();
    const blog = await Blog.findByPk(id);
    if (!blog) throw new Error('Not found');
    await blog.update(data);
    invalidate(id, blog.tags);
    return blog.toJSON();
}

export async function deleteBlog(id: string) {
    await requireAdmin();
    const blog = await Blog.findByPk(id);
    if (!blog) throw new Error('Not found');
    await blog.destroy();
    invalidate(id, blog.tags);
}

export async function setBlogState(id: string, state: BlogState) {
    return updateBlog(id, { state });
}
