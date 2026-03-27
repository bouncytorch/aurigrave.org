import BlogEditButton from '@/components/ui/button/blog/BlogEditButton';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'blog' };

export default function Blog() {
    return <main>
        <h1>BLOG</h1>
        <p>Under construction.</p>
        <Suspense>
            <BlogEditButton />
        </Suspense>
    </main>;
}
