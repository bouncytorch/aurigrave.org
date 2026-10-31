import { connection } from 'next/server';
import Loading from '@/components/layout/Loading';
import BlogEditButton from '@/components/ui/button/blog/BlogEditButton';
import BlogPost from '@/components/ui/button/blog/BlogPost';
import BlogPostWImage from '@/components/ui/button/blog/BlogPostWImage';
import { getPublishedBlogs } from '@/lib/db/blog/search';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllBlogs } from '@/lib/db/blog/admin';

export const metadata: Metadata = { title: 'blog' };

// TODO: Implement pagination

async function Posts() {
    await connection();
    let posts;
    try { posts = await getAllBlogs(); }
    catch { posts = await getPublishedBlogs(); }

    return <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {
            posts.rows.map(({ showThumbnail, id, title, description, createdAt, tags }) => showThumbnail
                ? <BlogPostWImage key={id} id={id} title={title} description={description} createdAt={createdAt} tags={tags} author='bouncytorch' />
                : <BlogPost key={id} id={id} title={title} description={description} createdAt={createdAt} tags={tags} author='bouncytorch' />
            )
        }
    </div>;
}

// TODO: Fix hardcoded style here

export default function Blog() {
    return <main>
        <h1> BLOG </h1>
        <div style={{ marginBottom: '1em', display: 'flex', justifyContent: 'space-between' }}>
            <Suspense>
                <BlogEditButton />
            </Suspense>
        </div>
        <Suspense fallback={ <Loading/> }>
            <Posts />
        </Suspense>

    </main>;
}
