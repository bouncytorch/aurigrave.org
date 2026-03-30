'use client';

import styles from './BlogPost.module.css';

import Link from 'next/link';

export default function BlogPost({ id, title, description, createdAt, tags, author }: { id: string, title: string, description: string, createdAt: Date, tags: string[], author: string, image?: string }) {
    return <Link href={`/blog/${id}`} className={styles.post}>
        <span>
            <h1>{title}</h1>
            {description}
        </span>
        <div>
            {tags.slice(0, 3).map((tag, index) => <div key={index} className={styles.tag}>{tag}</div>)}
        </div>
        <div className={styles.details}>
            <span>by {author}</span>
            <span style={{ justifySelf: 'flex-end' }}>{createdAt.toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            })}</span>
        </div>
    </Link>;
}
