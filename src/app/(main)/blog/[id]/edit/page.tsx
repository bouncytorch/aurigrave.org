import { Suspense } from 'react';
import { requireAdmin } from '@/lib/auth';
import MainError from '@/components/layout/MainError';
import BlogEditor from '@/components/layout/BlogEditor';
import { getAnyBlog } from '@/lib/db/blogs.admin';

async function BlogEditorPageContent({ params }: { params: Promise<{ id: string }> }) {
    try { await requireAdmin(); }
    catch {
        return <MainError title='UNAUTHORIZED' desc="You do not have access to this page" />;
    }

    const post = await getAnyBlog((await params).id);
    if (!post) return <MainError />;
    else return <BlogEditor
        id={post.id}
        old_title={post.title}
        old_content={post.content}
        old_desc={post.description}
        old_keywords={post.keywords}
        old_state={post.state}
        old_tags={post.tags}
    />;
}

export default function PostEditor({ params }: { params: Promise<{ id: string }> }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BlogEditorPageContent params={params}  />
        </Suspense>
    );
}
