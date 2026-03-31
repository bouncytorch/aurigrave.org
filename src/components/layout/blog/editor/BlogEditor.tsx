'use client';

import dynamic from 'next/dynamic';
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });
import { useEffect, useRef, useState } from 'react';
import H1Input from '@/components/ui/input/H1Input';
import { useTheme } from 'next-themes';
import { MarkdownHooks } from 'react-markdown';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import { createBlog, updateBlog, uploadBlogImage } from '@/lib/db/blog/admin';
import { BlogState } from '@/models/Blog';
import BlogOGWrapper from '../og/BlogOG';
import ThumbnailCropModal from '@/components/layout/blog/editor/ThumbnailCropModal';
import type { ICommand } from '@uiw/react-md-editor';
import { redirect } from 'next/navigation';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { remarkMark } from 'remark-mark-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkSupersub from 'remark-supersub';
import rehypeRaw from 'rehype-raw';
import BackButton from '@/components/ui/button/blog/BackButton';
// TODO: Not important, but maybe clean this up a little bit later

// icon rendered inside the toolbar button
const UploadImageIcon = (
    <svg
        width="12" height="12" viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
        <line x1="12" y1="12" x2="12" y2="6" />
        <polyline points="9 9 12 6 15 9" />
    </svg>
);

export default function BlogEditorContents({
    id,
    old_title    = '',
    old_desc     = '',
    old_content  = '',
    old_tags     = [],
    old_keywords = [],
    old_state    = 'draft' as BlogState,
    old_thumbnail = false,
    createdAt    = new Date(),
}: {
    id?:           string
    old_title?:    string
    old_tags?:     string[]
    old_keywords?: string[]
    old_desc?:     string
    old_content?:  string
    old_state?:    BlogState
    old_thumbnail?: boolean
    createdAt?:    Date
}) {
    // fields
    const [title,     setTitle]     = useState(old_title);
    const [desc,      setDesc]      = useState(old_desc);
    const [content,   setContent]   = useState(old_content);
    const [tags,      setTags]      = useState(old_tags);
    const [keywords,  setKeywords]  = useState(old_keywords);
    const [state,     setState]     = useState(old_state);
    const [thumbnail, setThumbnail] = useState<File | undefined>();
    const [showThumbnail,  setShowThumbnail]  = useState(old_thumbnail);
    const [cropFile,  setCropFile] = useState<File | undefined>();

    // misc
    const { resolvedTheme }       = useTheme();
    const [result,   setResult]   = useState('save');
    const [response, setResponse] = useState('');

    // preview
    const [showMDPreview, setShowMDPreview] = useState(false);
    const [showOGPreview, setShowOGPreview] = useState(true);
    const [thumbnailPreview, setThumbnailPreview] = useState(
        id ? `https://files.aurigrave.org/bouncytorch/blog/thumbnails/${id}.webp` : ''
    );

    useEffect(() => {
        if (id) {
            setThumbnailPreview(
                `https://files.aurigrave.org/bouncytorch/blog/thumbnails/${id}.webp?t=${Date.now()}`
            );
        }
    }, [id]);

    useEffect(() => {
        return () => { if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview); };
    }, [thumbnailPreview]);

    // image-upload state
    const [uploadingImage, setUploadingImage] = useState(false);

    /**
     * Hidden <input type="file"> that the toolbar button programmatically
     * clicks. Kept outside the form so it doesn't interfere with submit.
     */
    const imageFileInputRef = useRef<HTMLInputElement>(null);

    /**
     * We track the last known caret offset so we can splice the image
     * markdown at the right position after the (async) upload finishes.
     * onSelect / onKeyUp / onMouseUp keep it in sync.
     */
    const cursorPosRef = useRef<number>(0);

    // helpers

    /** Insert `markdown` at the last tracked caret position. */
    function insertAtCursor(markdown: string) {
        setContent(prev => {
            const pos    = cursorPosRef.current;
            const before = prev.slice(0, pos);
            const after  = prev.slice(pos);
            // Ensure the image is on its own line
            const prefix = before.length > 0 && !before.endsWith('\n') ? '\n' : '';
            const result = `${before}${prefix}${markdown}\n${after}`;
            // Advance cursor past the inserted text
            cursorPosRef.current = pos + prefix.length + markdown.length + 1;
            return result;
        });
    }

    /**
     * Transcode + upload one image file, then splice the resulting markdown
     * into the editor at the current caret position.
     */
    async function handleImageUpload(file: File) {
        if (!id) {
            alert('Save the blog post first — an id is required to upload images.');
            return;
        }
        if (!file.type.startsWith('image/')) return;

        setUploadingImage(true);
        try {
            const result = await uploadBlogImage(id, file);
            // Strip extension for a cleaner alt text
            const alt = file.name.replace(/\.[^/.]+$/, '') || 'image';
            insertAtCursor(`![${alt}](${result.fileurl})`);
        } catch (err) {
            alert(`Image upload failed: ${String(err)}`);
        } finally {
            setUploadingImage(false);
            // Reset so the same file can be re-selected later
            if (imageFileInputRef.current) imageFileInputRef.current.value = '';
        }
    }

    // custom toolbar command
    const uploadImageCommand: ICommand = {
        name:       'uploadImage',
        keyCommand: 'uploadImage',
        buttonProps: {
            'aria-label': uploadingImage ? 'Uploading…' : 'Upload image',
            title:        id ? 'Upload image' : 'Save the post first to enable image uploads',
            disabled:     uploadingImage || !id,
        },
        icon:    UploadImageIcon,
        execute: () => {
            if (!id) {
                alert('Save the blog post first — an id is required to upload images.');
                return;
            }
            imageFileInputRef.current?.click();
        },
    };

    return (
        <main>
            <div style={{ marginBottom: '1em', display: 'flex', justifyContent: 'space-between' }}>
                <BackButton />
            </div>
            {/* Hidden file picker - sits outside the form intentionally */}
            <input
                ref={imageFileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) await handleImageUpload(file);
                }}
            />

            <form onSubmit={async function (e) {
                e.preventDefault();

                const payload = {
                    title: title.toUpperCase(),
                    description: desc,
                    content,
                    tags,
                    keywords,
                    showThumbnail,
                    state
                };

                setResult('...');
                try {
                    let response;
                    if (id)
                        response = await updateBlog(id, payload, thumbnail);
                    else {
                        response = await createBlog(payload, thumbnail);
                        redirect(`/blog/${response.id}/edit`);
                    }
                    setResult('success');
                    setResponse(JSON.stringify(response, null, 2));
                } catch (err) {
                    if (isRedirectError(err)) throw err;
                    setResult('error');
                    setResponse(String(err));
                }
            }}>
                <fieldset>
                    <H1Input
                        id="title" name="title" required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <textarea
                        placeholder='Description goes here!'
                        style={{ fontSize: '1.3em', fontWeight: '300' }}
                        maxLength={255}
                        name="desc" id="desc"
                        defaultValue={old_desc}
                        onChange={(e) => setDesc(e.target.value)}
                        required
                    />

                    <p>
                        <label htmlFor="keywords">tags: </label>
                        <textarea
                            placeholder='tags' name="tags" id="tags"
                            value={tags.join(',')}
                            onChange={(e) => setTags(e.target.value.split(','))}
                        />
                    </p>

                    <p>
                        <label htmlFor="keywords">search keywords: </label>
                        <textarea
                            placeholder='search keywords' name="keywords" id="keywords"
                            value={keywords.join(',')}
                            onChange={(e) => setKeywords(e.target.value.split(','))}
                        />
                    </p>

                    <p>
                        <label htmlFor="show-thumbnail">show thumbnail: </label>
                        <input
                            type="checkbox" id="show-thumbnail"
                            checked={showThumbnail}
                            onChange={(e) => setShowThumbnail(e.target.checked)}
                        />
                    </p>

                    <p>
                        <label htmlFor="thumbnail">thumbnail: </label>
                        <input
                            type="file" name="thumbnail" id="thumbnail"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setCropFile(file);   // open modal instead of setting directly
                                e.target.value = '';           // allow re-selecting the same file later
                            }}
                        />
                    </p>

                    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ position: 'relative' }}>
                            <MDEditor
                                style={{ minWidth: 0, zoom: 1.3 }}
                                data-color-mode={resolvedTheme === 'dark' ? 'dark' : 'light'}
                                height={500}
                                preview="edit"
                                extraCommands={[uploadImageCommand]}
                                onChange={(val) => setContent(val ?? '')}
                                id='content'
                                value={content}
                                textareaProps={{
                                    // Keep cursorPosRef in sync so insertAtCursor is accurate
                                    onSelect:  (e) => { cursorPosRef.current = (e.target as HTMLTextAreaElement).selectionStart; },
                                    onKeyUp:   (e) => { cursorPosRef.current = (e.target as HTMLTextAreaElement).selectionStart; },
                                    onMouseUp: (e) => { cursorPosRef.current = (e.target as HTMLTextAreaElement).selectionStart; },

                                    // Paste: intercept clipboard images (e.g. screenshots)
                                    onPaste: async (e) => {
                                        const items = Array.from(e.clipboardData?.items ?? []);
                                        const imageItem = items.find(item => item.type.startsWith('image/'));
                                        if (!imageItem) return;           // let normal text paste through
                                        e.preventDefault();
                                        const file = imageItem.getAsFile();
                                        if (file) await handleImageUpload(file);
                                    },

                                    // Drag-and-drop images onto the editor surface
                                    onDragOver: (e) => { e.preventDefault(); },
                                    onDrop: async (e) => {
                                        e.preventDefault();
                                        const files = Array.from(e.dataTransfer?.files ?? []);
                                        const imageFile = files.find(f => f.type.startsWith('image/'));
                                        if (imageFile) await handleImageUpload(imageFile);
                                    },
                                }}
                            />

                            {uploadingImage && (
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'rgba(0,0,0,0.25)',
                                    borderRadius: 4,
                                    color: '#fff',
                                    fontSize: '0.95em',
                                    pointerEvents: 'none',
                                }}>
                                    uploading image…
                                </div>
                            )}
                        </div>

                        <input
                            type="text"
                            name="content"
                            defaultValue={content}
                            onChange={() => {}}
                            required
                            style={{
                                opacity: 0, position: 'absolute',
                                pointerEvents: 'none', width: 0, height: 0, overflow: 'hidden',
                            }}
                            aria-hidden="true"
                        />
                    </div>

                    <p>
                        <label htmlFor="state">State: </label>
                        <select
                            id="state" name="state" value={state}
                            onChange={(e) => setState(e.target.value as typeof state)}
                        >
                            <option>draft</option>
                            <option>unlisted</option>
                            <option>published</option>
                        </select>
                    </p>
                </fieldset>

                <fieldset>
                    <legend style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <label htmlFor="preview-toggle">markdown preview</label>
                        <input
                            type="checkbox" id="preview-toggle"
                            checked={showMDPreview}
                            onChange={(e) => setShowMDPreview(e.target.checked)}
                        />
                    </legend>
                    {showMDPreview && (
                        <MarkdownHooks
                            remarkPlugins={[
                                [remarkGfm, { singleTilde: false }],
                                remarkSupersub,
                                remarkMark
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
                            {content}
                        </MarkdownHooks>
                    )}
                </fieldset>

                <fieldset>
                    <legend style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <label htmlFor="og-preview-toggle">og image preview</label>
                        <input
                            type="checkbox" id="og-preview-toggle"
                            checked={showOGPreview}
                            onChange={(e) => setShowOGPreview(e.target.checked)}
                        />
                    </legend>
                    {showOGPreview && (
                        <BlogOGWrapper
                            title={title}
                            description={desc}
                            createdAt={createdAt}
                            image={thumbnailPreview}
                        />
                    )}
                </fieldset>

                <p><input type="submit" value={result} /></p>
                <pre data-language='json'>{response}</pre>
            </form>
            {cropFile && (
                <ThumbnailCropModal
                    file={cropFile}
                    onConfirm={(croppedFile) => {
                        if (thumbnailPreview.startsWith('blob:')) URL.revokeObjectURL(thumbnailPreview);
                        setThumbnail(croppedFile);
                        setThumbnailPreview(URL.createObjectURL(croppedFile));
                        setCropFile(undefined);
                    }}
                    onCancel={() => setCropFile(undefined)}
                />
            )}
        </main>
    );
}
