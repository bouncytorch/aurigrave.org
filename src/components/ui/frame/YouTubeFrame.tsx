'use client';

import styles from './YouTubeFrame.module.css';

export default function YouTubeFrame({ link }: { link: string }) {
    let src = link;
    if (src && (src.includes('youtube.com') || src.includes('youtu.be'))) {
        const separator = src.includes('?') ? '&' : '?';
        if (!src.includes('enablejsapi=1')) {
            src = `${src}${separator}enablejsapi=1`;
        }
    }

    return (
        <div className={styles.videoContainer}>
            <iframe
                src={src}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
            ></iframe>
        </div>
    );
}
