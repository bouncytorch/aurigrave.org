import styles from './BlogOG.module.css';

export function BlogOG({ title, description, createdAt, image, author = 'bouncytorch' }: {
    title: string
    description: string
    createdAt: Date
    image?: string
    author?: string
}) {
    return <div
        className={styles.blogog}
        style={{ '--_bg-image': image ? `url(${image})` : 'none' } as React.CSSProperties}
    >
        <div>
            <h1>{title}</h1>
            <h2>{description}</h2>
        </div>
        <div>
            <div>by {author}</div>
            <div>{createdAt.toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            })}</div>
        </div>
    </div>;
}

export default function BlogOGWrapper({ title, description, createdAt, image, author = 'bouncytorch' }: {
    title: string
    description: string
    createdAt: Date
    image?: string
    author?: string
}) {
    return <div className={styles.blogogwrapper}>
        <BlogOG
            title={title}
            description={description}
            createdAt={createdAt}
            image={image}
            author={author}
        />
    </div>;
}
