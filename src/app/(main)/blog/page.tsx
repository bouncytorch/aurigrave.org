export const dynamic = 'force-dynamic';

import BlogEditButton from '@/components/ui/button/blog/BlogEditButton';
import BlogPost from '@/components/ui/button/blog/BlogPost';
import BlogPostWImage from '@/components/ui/button/blog/BlogPostWImage';
import { getPublishedBlogs } from '@/lib/db/blog/search';
import { Metadata } from 'next';
import { getAllBlogs } from '@/lib/db/blog/admin';

export const metadata: Metadata = { title: 'blog' };

// TODO: Implement pagination

// TODO: Fix hardcoded style here

export default async function Blog() {
    let posts;
    try { posts = await getAllBlogs(); }
    catch { posts = await getPublishedBlogs(); }

    return (
        <main>
            <h1> BLOG </h1>
            <div style={{ marginBottom: '1em', display: 'flex', justifyContent: 'space-between' }}>
                <BlogEditButton />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {
                    posts.rows.map(({ showThumbnail, id, title, description, createdAt, tags }) => showThumbnail
                        ? <BlogPostWImage key={id} id={id} title={title} description={description} createdAt={createdAt} tags={tags} author='bouncytorch' />
                        : <BlogPost key={id} id={id} title={title} description={description} createdAt={createdAt} tags={tags} author='bouncytorch' />
                    )
                }
            </div>
        </main>
    );
}
