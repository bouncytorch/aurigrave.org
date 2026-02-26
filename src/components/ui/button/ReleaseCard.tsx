'use client';

import Release from '@/models/Release';
import Link from 'next/link';

import styles from './ReleaseCard.module.css';
import { InferAttributes } from 'sequelize';
import CoverImage from '../CoverImage';

export default function ReleaseCard({ release }: { release: InferAttributes<Release> }) {
    return <Link className={styles.releaseCardLink} href={`/audio/release/${release.id}`}>
        <button className={styles.releaseCard}>
            <CoverImage src={release.cover_url} alt={`${release.name} cover`} size={200} style={ { maxWidth: '220px' } }/>
            <p style={{ fontWeight: 400 }}>{release.shortname}</p>
            <p style={{ fontSize: '0.8em', opacity: 0.6 }}>
                {release.release_date ? new Date(release.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '(TBA)'}<br/>
                {release.genres.slice(0, 3).join(', ')}
            </p>
        </button>
    </Link>;
}
