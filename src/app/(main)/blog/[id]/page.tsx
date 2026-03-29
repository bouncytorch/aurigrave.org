import Loading from '@/components/layout/Loading';
import MainError from '@/components/layout/MainError';
import { getPublicBlog } from '@/lib/db/blog/search';
import { Suspense } from 'react';
import { MarkdownAsync } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import BlogEditButton from '@/components/ui/button/blog/BlogEditButton';
import rehypeSlug from 'rehype-slug';
import { remarkMark } from 'remark-mark-highlight';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkSupersub from 'remark-supersub';

async function BlogPostContent({ params }: { params: Promise<{ id: string }> }) {
    const props = await params;
    const post = await getPublicBlog(props.id);

    if (!post)
        return <MainError />;

    else return <main>
        <h1>{post.title}</h1>
        <MarkdownAsync
            remarkPlugins={[
                [remarkGfm, { singleTilde: false }],
                remarkMark,
                remarkSupersub
            ]}
            rehypePlugins={[
                [rehypePrettyCode, { theme: 'github-dark-dimmed' }],
                rehypeSlug,
                [rehypeAutolinkHeadings, {
                    behavior: 'append',
                    properties: { className: ['heading-anchor'] },
                    content: { type: 'text', value: '(#)' }
                }]
            ]}
        >
            {post.content}
        </MarkdownAsync>
        <BlogEditButton id={post.id} />
    </main>;
}

export default function BlogPost({ params }: { params: Promise<{ id: string }> }) {
    return (
        <Suspense fallback={<Loading/>}>
            <BlogPostContent params={params} />
        </Suspense>
    );
}
