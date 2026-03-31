import { Suspense } from 'react';
import { requireAdmin } from '@/lib/auth';
import MainError from '@/components/layout/MainError';
import BlogEditor from '@/components/layout/blog/editor/BlogEditor';

async function PostEditorContent() {
    try { await requireAdmin(); }
    catch(err) {
        if (err === 'Unauthorized')
            return <MainError title='UNAUTHORIZED' desc="You do not have access to this page" />;
        return <MainError title="ERROR" desc={String(err)} />;
    }

    return <BlogEditor />;
}

export default function PostEditor() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PostEditorContent />
        </Suspense>
    );
}
