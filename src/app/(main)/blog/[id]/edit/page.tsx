export const dynamic = 'force-dynamic';

import { requireAdmin } from '@/lib/auth';
import MainError from '@/components/layout/MainError';
import BlogEditor from '@/components/layout/blog/editor/BlogEditor';
import { getAnyBlog } from '@/lib/db/blog/admin';

export default async function PostEditor({ params }: { params: Promise<{ id: string }> }) {
    try { await requireAdmin(); }
    catch(err) {
        if (err instanceof Error && err.message === 'Unauthorized')
            return <MainError title='UNAUTHORIZED' desc="You do not have access to this page" />;
        return <MainError title="ERROR" desc={String(err)} />;
    }

    const post = await getAnyBlog((await params).id);
    if (!post) return <MainError />;
    return <BlogEditor
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
