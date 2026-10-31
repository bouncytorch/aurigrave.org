import { Suspense } from 'react';
import { requireAdmin } from '@/lib/auth';
import MainError from '@/components/layout/MainError';
import BlogEditor from '@/components/layout/blog/editor/BlogEditor';
import { getAnyBlog } from '@/lib/db/blog/admin';

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

async function BlogEditorPageContent({ params }: { params: Promise<{ id: string }> }) {
    try { await requireAdmin(); }
    catch(err) {
        if (err instanceof Error && err.message === 'Unauthorized')
            return <MainError title='UNAUTHORIZED' desc="You do not have access to this page" />;
        return <MainError title="ERROR" desc={String(err)} />;
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
        old_thumbnail={post.showThumbnail}
        createdAt={post.createdAt}
    />;
}

export default function PostEditor({ params }: { params: Promise<{ id: string }> }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BlogEditorPageContent params={params}  />
        </Suspense>
    );
}
