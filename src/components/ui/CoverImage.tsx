'use client';

import Image from 'next/image';
import { CSSProperties } from 'react';
import styles from './CoverImage.module.css';

// PlaceholderSVG.tsx
function PlaceholderSVG() {
    return (
        <svg className={styles.coverPlaceholder} viewBox="-15 -15 190 190" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M160 80C160 124.183 124.183 160 80 160C35.8172 160 0 124.183 0 80C0 35.8172 35.8172 0 80 0C124.183 0 160 35.8172 160 80ZM67.154 80C67.154 87.0946 72.9054 92.846 80 92.846C87.0946 92.846 92.846 87.0946 92.846 80C92.846 72.9054 87.0946 67.154 80 67.154C72.9054 67.154 67.154 72.9054 67.154 80Z" />
        </svg>
    );
}

export default function CoverImage({ src, alt, size, style }: {
    src: string; alt: string; size: number; style?: CSSProperties;
}) {
    return (
        <div style={{ position: 'relative', width: size, height: size, zIndex: 1, ...style }}>
            <PlaceholderSVG />
            <Image
                className={styles.cover}
                src={src}
                width={size}
                height={size}
                onError={(e) => (e.target as HTMLImageElement).style.opacity = '0'}
                alt={alt}
            />
        </div>
    );
}
