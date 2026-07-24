import styles from './BlogOG.module.css';

import LocalTime from '@/components/ui/LocalTime';

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
            <div><LocalTime date={createdAt} /></div>
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
