import Release from '@/models/Release';
import Link from 'next/link';
import Image from 'next/image';

import styles from './ReleaseCard.module.css';
import { InferAttributes } from 'sequelize';

export default function ReleaseCard({ release }: { release: InferAttributes<Release> }) {
    return <Link className={styles.releaseCardLink} href={`/audio/album/${release.id}`}>
        <button className={styles.releaseCard}>
            <Image src={release.cover_url} width={220} height={220} alt={`${release.name} cover`}/>
            <p style={{ fontWeight: 400 }}>{release.shortname}</p>
            <p style={{ fontSize: '0.8em', opacity: 0.6 }}>
                {release.release_date && new Date(release.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}<br/>
                {release.genres.slice(0, 3).join(', ')}
            </p>
        </button>
    </Link>;
}
