'use client';

import styles from './YouTubeFrame.module.css';

export default function YouTubeFrame({ link }: { link: string }) {
    return <div className={styles.videoContainer}>
        <iframe
            src={link}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
        ></iframe>
    </div>;
}
