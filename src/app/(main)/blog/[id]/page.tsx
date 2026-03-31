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
import BlogShareButton from '@/components/ui/button/blog/BlogShareButton';
import Image from 'next/image';
import { getRelativeURL } from '@/lib/server/copyparty';
import rehypeRaw from 'rehype-raw';

import type { Metadata, ResolvingMetadata } from 'next';
import BackButton from '@/components/ui/button/blog/BackButton';
import { getAnyBlog } from '@/lib/db/blog/admin';

export async function generateMetadata(
    { params }: { params: Promise<{ id: string }> },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;
    const post = await getPublicBlog(id);

    const parentKeywords = (await parent).keywords ?? [];

    if (!post) {
        return {
            title: 'Post Not Found',
            robots: { index: false },
        };
    }

    const ogUrl = getRelativeURL(`/bouncytorch/blog/og/${post.id}.png`);

    return {
        title: post.title,
        description: post.description,
        keywords: [...parentKeywords, ...(post.keywords ?? [])],

        openGraph: {
            type: 'article',
            publishedTime: post.createdAt.toISOString(),
            modifiedTime: post.updatedAt.toISOString(),
            authors: ['bouncytorch'],
            images: [{
                url: ogUrl,
                alt: post.title,
            }],
        },

        twitter: {
            card: 'summary_large_image',
        },
    };
}

async function BlogPostContent({ params }: { params: Promise<{ id: string }> }) {
    const props = await params;
    let post;
    try { post = await getAnyBlog(props.id); }
    catch { post = await getPublicBlog(props.id); }

    if (!post)
        return <MainError />;

    // TODO: Fix hardcoded author & styles
    return <>
        <h1 style={{ marginBottom: '0.1em' }}>{post.title}</h1>
        <p style={{ fontWeight: 300, marginTop: 0, fontSize: '1.3em' }}>{post.description}</p>
        <div style={{ marginBottom: '1em', display: 'flex', justifyContent: 'space-between' }}>
            <BackButton />
            <Suspense>
                <BlogEditButton />
            </Suspense>
        </div>
        {post.showThumbnail && (
            <div style={{
                position: 'relative',
                width: '100%',
                height: '400px',
                borderRadius: '10px',
                overflow: 'hidden'
            }}>
                <Image
                    alt='Blog post thumbnail image'
                    src={getRelativeURL(`/bouncytorch/blog/thumbnails/${post.id}.webp`)}  // ← inline, drop variable
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
            </div>
        )}
        <p style={{ fontWeight: '100', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <span>by bouncytorch</span>
            <span style={{ textAlign:'right' }}>
                {post.createdAt.toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                })}
                {post.createdAt !== post.updatedAt
                && <span style={{ opacity: 0.4 }}><br/>(edited) {post.updatedAt.toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                })}
                </span>}
            </span>
        </p>
        <span style={{ textAlign: 'right' }}><BlogShareButton id={post.id} /></span>
        <hr />
        <MarkdownAsync
            remarkPlugins={[
                [remarkGfm, { singleTilde: false }],
                remarkMark,
                remarkSupersub
            ]}
            rehypePlugins={[
                [rehypePrettyCode, { theme: 'github-dark-dimmed' }],
                rehypeRaw,
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
    </>;
}

export default function BlogPost({ params }: { params: Promise<{ id: string }> }) {
    return (
        <Suspense fallback={<Loading/>}>
            <BlogPostContent params={params} />
        </Suspense>
    );
}
