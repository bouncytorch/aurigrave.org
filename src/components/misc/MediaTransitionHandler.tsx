'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import styles from './TopLoadingBar.module.css';

export function stopAllMediaPlayback() {
    // 1. Stop all HTML audio elements
    const audioElements = document.querySelectorAll<HTMLMediaElement>('audio');
    audioElements.forEach(audio => {
        try {
            audio.pause();
            audio.currentTime = 0;
        } catch {
            // ignore
        }
    });

    // 2. Stop all HTML video elements
    const videoElements = document.querySelectorAll<HTMLMediaElement>('video');
    videoElements.forEach(video => {
        try {
            video.pause();
            video.currentTime = 0;
        } catch {
            // ignore
        }
    });

    // 3. Stop all YouTube iframes
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        try {
            iframe.contentWindow?.postMessage(
                JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
                '*'
            );
            iframe.contentWindow?.postMessage(
                JSON.stringify({ event: 'command', func: 'stopVideo', args: [] }),
                '*'
            );
        } catch {
            // ignore
        }
    });
}

function isInternalNavigation(anchor: HTMLAnchorElement): boolean {
    if (anchor.target && anchor.target !== '_self') return false;
    if (anchor.hasAttribute('download')) return false;

    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return false;
    }

    try {
        const targetUrl = new URL(anchor.href, window.location.href);
        const currentUrl = new URL(window.location.href);

        if (targetUrl.origin !== currentUrl.origin) return false;
        if (targetUrl.pathname === currentUrl.pathname && targetUrl.search === currentUrl.search) {
            return false;
        }
        return true;
    } catch {
        return false;
    }
}

export default function MediaTransitionHandler() {
    const pathname = usePathname();
    const prevPathname = useRef(pathname);

    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutFadeRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutResetRef = useRef<NodeJS.Timeout | null>(null);

    const clearTimers = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (timeoutFadeRef.current) clearTimeout(timeoutFadeRef.current);
        if (timeoutResetRef.current) clearTimeout(timeoutResetRef.current);
        intervalRef.current = null;
        timeoutFadeRef.current = null;
        timeoutResetRef.current = null;
    }, []);

    const startLoading = useCallback(() => {
        clearTimers();
        setVisible(true);
        setProgress(25);

        intervalRef.current = setInterval(() => {
            setProgress(prev => {
                if (prev >= 85) return prev;
                return prev + (90 - prev) * 0.1;
            });
        }, 150);
    }, [clearTimers]);

    const completeLoading = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;

        setProgress(100);

        timeoutFadeRef.current = setTimeout(() => {
            setVisible(false);
        }, 250);

        timeoutResetRef.current = setTimeout(() => {
            setProgress(0);
        }, 550);
    }, []);

    useEffect(() => {
        if (prevPathname.current !== pathname) {
            stopAllMediaPlayback();
            completeLoading();
            prevPathname.current = pathname;
        }
    }, [pathname, completeLoading]);

    useEffect(() => {
        const handleLinkClick = (e: MouseEvent) => {
            if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
                return;
            }

            const target = (e.target as HTMLElement)?.closest('a');
            if (!target || !target.href) return;

            if (isInternalNavigation(target)) {
                stopAllMediaPlayback();
                startLoading();
            }
        };

        const handlePopState = () => {
            stopAllMediaPlayback();
            startLoading();
        };

        const handlePlay = (e: Event) => {
            if (e.target instanceof HTMLMediaElement) {
                const playingMedia = e.target;
                document.querySelectorAll<HTMLMediaElement>('audio, video').forEach(media => {
                    if (media !== playingMedia && !media.paused) {
                        try {
                            media.pause();
                        } catch {
                            // ignore
                        }
                    }
                });
            }
        };

        document.addEventListener('click', handleLinkClick, true);
        window.addEventListener('popstate', handlePopState);
        document.addEventListener('play', handlePlay, true);

        return () => {
            document.removeEventListener('click', handleLinkClick, true);
            window.removeEventListener('popstate', handlePopState);
            document.removeEventListener('play', handlePlay, true);
            clearTimers();
        };
    }, [startLoading, clearTimers]);

    return (
        <div
            className={styles.container}
            style={{
                opacity: visible ? 1 : 0,
                display: progress === 0 && !visible ? 'none' : 'block'
            }}
        >
            <div className={styles.bar} style={{ width: `${progress}%` }} />
        </div>
    );
}
