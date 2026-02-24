import Release from '@/models/Release';
import ReleaseCard from '../ui/button/ReleaseCard';

import styles from './ReleaseCardList.module.css';
import { InferAttributes } from 'sequelize';

export default function ReleaseCardList({ releases }: { releases: InferAttributes<Release>[] }) {
    return <div className={styles.releaseCardList}>
        {releases.map((release) => <ReleaseCard key={release.id} release={release}/>)}
    </div>;
}
