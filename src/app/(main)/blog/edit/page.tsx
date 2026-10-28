export const dynamic = 'force-dynamic';

import { requireAdmin } from '@/lib/auth';
import MainError from '@/components/layout/MainError';
import BlogEditor from '@/components/layout/blog/editor/BlogEditor';

export default async function PostEditor() {
    try { await requireAdmin(); }
    catch(err) {
        if (err instanceof Error && err.message === 'Unauthorized')
            return <MainError title='UNAUTHORIZED' desc="You do not have access to this page" />;
        return <MainError title="ERROR" desc={String(err)} />;
    }

    return <BlogEditor />;
}
