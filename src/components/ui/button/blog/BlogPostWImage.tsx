'use client';

import styles from './BlogPost.module.css';

import Link from 'next/link';

import LocalTime from '@/components/ui/LocalTime';

export default function BlogPostWImage({ id, title, description, createdAt, tags, author }: { id: string, title: string, description: string, createdAt: Date, tags: string[], author: string }) {
    return <Link
        href={`/blog/${id}`}
        style={{ '--thumb': `url(https://files.aurigrave.org/bouncytorch/blog/thumbnails/${id}.webp)` } as React.CSSProperties}
        className={styles.post + ' ' + styles.with_image}>
        <div className={styles.details}>
            <div>
                {tags.slice(0, 3).map((tag, index) => <div key={index} className={styles.tag}>{tag}</div>)}
            </div>
            <span><LocalTime date={createdAt} /></span>
        </div>

        <span>
            <h1>{title}</h1>

            <div style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <span style={{ flex: 1, minWidth: 0 }}>{description}</span>
                <span style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>by {author}</span>
            </div>
        </span>
    </Link>;
}
