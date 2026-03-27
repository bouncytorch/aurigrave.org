'use client';

import MDEditor from '@uiw/react-md-editor';
import { useState } from 'react';
import H1Input from '@/components/ui/input/H1Input';
import { useTheme } from 'next-themes';
import { MarkdownHooks } from 'react-markdown';
import rehypePrettyCode from 'rehype-pretty-code';

export default function App() {
    const [ content, setContent ] = useState('');
    const [ showPreview, setShowPreview ] = useState(false);
    const { resolvedTheme } = useTheme();

    return (
        <main>
            <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                formData.set('content', content);
                formData.set('title', formData.get('title')!.toString().toUpperCase());
                console.log(Object.fromEntries(formData.entries()));
            }}>
                <fieldset>
                    <H1Input id="title" name="title" required />
                    <textarea
                        placeholder='Description goes here!'
                        style={{ width: '100%', fontSize: '1.3em', fieldSizing: 'content', resize: 'none' }}
                        maxLength={200}
                        name="desc"
                        id="desc"
                        required
                    />
                    <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        <MDEditor
                            style={{ flex: '1 1 400px', minWidth: 0 }}
                            data-color-mode={resolvedTheme === 'dark' ? 'dark' : 'light'}
                            height={500}
                            value={content}
                            preview="edit"
                            extraCommands={[]}
                            onChange={(val) => setContent(val ?? '')}
                            id='content'
                        />
                        <input
                            type="text"
                            name="content"
                            value={content}
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
                                <label htmlFor="preview-toggle">Preview</label>
                                <input
                                    type="checkbox"
                                    id="preview-toggle"
                                    checked={showPreview}
                                    onChange={(e) => setShowPreview(e.target.checked)}
                                />
                            </legend>
                            {showPreview && (
                                <MarkdownHooks rehypePlugins={[ [rehypePrettyCode, { theme: 'github-dark-dimmed' }], ]}>
                                    {content}
                                </MarkdownHooks>
                            )}
                        </fieldset>
                    </div>
                </fieldset>

                <p><input type="submit" value="create" /></p>
            </form>
        </main>
    );
}
