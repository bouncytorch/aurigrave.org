'use client';

import dynamic from 'next/dynamic';
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });
import { useState } from 'react';
import H1Input from '@/components/ui/input/H1Input';
import { useTheme } from 'next-themes';
import { MarkdownHooks } from 'react-markdown';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import { createBlog, updateBlog } from '@/lib/db/blogs.actions';
import { BlogState } from '@/models/Blog';
export default function BlogEditorContents({
    id,
    old_title = '',
    old_desc  = '',
    old_content = '',
    old_tags = [],
    old_keywords = [],
    old_state = 'draft' as BlogState
}: {
    id?: string,
    old_title?: string,
    old_tags?: string[],
    old_keywords?: string[],
    old_desc?: string,
    old_content?: string,
    old_state?: BlogState
}) {
    const [ title, setTitle ] = useState(old_title);
    const [ desc, setDesc ] = useState(old_desc);
    const [ content, setContent ] = useState(old_content);
    const [ tags, setTags ] = useState(old_tags);
    const [ keywords, setKeywords ] = useState(old_keywords);
    const [ showPreview, setShowPreview ] = useState(false);
    const { resolvedTheme } = useTheme();
    const [ state, setState ] = useState(old_state);
    const [ res, setRes ] = useState('save');

    return (
        <main>
            <form onSubmit={(e) => {
                e.preventDefault();

                const payload = {
                    title: title.toUpperCase(),
                    description: desc,
                    content,
                    tags,
                    keywords,
                    state
                };

                setRes('...');
                if (id)
                    updateBlog(id, payload).then(() => {
                        setRes('success');
                    }).catch((err) => {
                        setRes(err);
                    });
                else createBlog(payload).then(() => {
                    setRes('success');
                }).catch((err) => {
                    setRes(err);
                });
            }}>
                <fieldset>
                    <H1Input id="title" name="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
                    <textarea
                        placeholder='Description goes here!'
                        style={{ fontSize: '1.3em' }}
                        maxLength={200}
                        name="desc"
                        id="desc"
                        defaultValue={old_desc}
                        onChange={(e) => setDesc(e.target.value)}
                        required
                    />
                    <p>
                        <label htmlFor="keywords">tags: </label>
                        <textarea placeholder='tags' name="tags" id="tags" value={tags.join(',')} onChange={(e) => setTags(e.target.value.split(','))} />
                    </p>
                    <p>
                        <label htmlFor="keywords">search keywords: </label>
                        <textarea placeholder='search keywords' name="keywords" id="keywords" value={keywords.join(',')} onChange={(e) => setKeywords(e.target.value.split(','))} />
                    </p>
                    <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        <MDEditor
                            style={{ flex: '1 1 400px', minWidth: 0 }}
                            data-color-mode={resolvedTheme === 'dark' ? 'dark' : 'light'}
                            height={500}
                            preview="edit"
                            extraCommands={[]}
                            onChange={(val) => setContent(val ?? '')}
                            id='content'
                            value={content}
                        />
                        <input
                            type="text"
                            name="content"
                            defaultValue={content}
                            onChange={() => {}}
                            required
                            style={{
                                opacity: 0,
                                position: 'absolute',
                                pointerEvents: 'none',
                                width: 0,
                                height: 0,
                                overflow: 'hidden',
                            }}
                            aria-hidden="true"
                        />
                        <fieldset style={{ flex: '1 1 300px', minWidth: 0 }}>
                            <legend style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <label htmlFor="preview-toggle">preview</label>
                                <input
                                    type="checkbox"
                                    id="preview-toggle"
                                    checked={showPreview}
                                    onChange={(e) => setShowPreview(e.target.checked)}
                                />
                            </legend>
                            {showPreview && (
                                <MarkdownHooks
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[ [rehypePrettyCode, { theme: 'github-dark-dimmed' }], ]}
                                >
                                    {content}
                                </MarkdownHooks>
                            )}
                        </fieldset>
                    </div>
                    <p>
                        <label htmlFor="state">State: </label>
                        <select
                            id="state"
                            name="state"
                            value={state}
                            onChange={(e) => setState(e.target.value as typeof state)}
                        >
                            <option>draft</option>
                            <option>unlisted</option>
                            <option>published</option>
                        </select>
                    </p>
                </fieldset>

                <p><input type="submit" value={res} /></p>
            </form>
        </main>
    );
}
