import { Suspense } from 'react';
import { BlogOG } from '@/components/layout/blog/og/BlogOG';
import { getPublicBlog } from '@/lib/db/blog/search';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getRelativeURL } from '@/lib/server/copyparty';

async function OGContent({ params }: { params: Promise<{ id: string }> }) {
    const blog = await getPublicBlog((await params).id);
    if (!blog) notFound();
    return (
        <Link href={`/blog/${blog.id}`} target='_blank' style={{ color: 'inherit' }}>
            { BlogOG({ ...blog, image: getRelativeURL(`/bouncytorch/blog/thumbnails/${blog.id}.webp`) }) }
        </Link>
    );
}

export default async function OGEmbedPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <Suspense>
            <OGContent params={params} />
        </Suspense>
    );
}
