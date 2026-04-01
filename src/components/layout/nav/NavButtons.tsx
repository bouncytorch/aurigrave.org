'use client';

import { usePathname } from 'next/navigation';
import styles from './NavButtons.module.css';
import LinkButton from '@/components/ui/button/LinkButton';
import { faQuoteRight, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';

export default function NavButtons() {
    const path = usePathname();
    return <div className={styles['nav-buttons']}>
        <LinkButton label='audio' href='/audio' disabled={path === '/audio'} icon={faVolumeHigh} />
        <LinkButton label='blog' href='/blog' disabled={path === '/blog'}  icon={faQuoteRight} />
    </div>;
}
