'use client';

import { usePathname } from 'next/navigation';
import styles from './NavButtons.module.css';
import LinkButton from '@/components/ui/button/LinkButton';
import ThemeButton from '@/components/ui/button/ThemeButton';
import { faCodeBranch, faQuoteRight, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';

export default function NavButtons({ iconBreakpoint }: { iconBreakpoint: string }) {
    const path = usePathname();
    return <div className={styles['nav-buttons']}>
        { path !== '/' && <ThemeButton /> }
        <LinkButton label='audio' href='/audio' disabled={path === '/audio'} icon={faVolumeHigh} iconBreakpoint={iconBreakpoint} />
        <LinkButton label='software' href='/software' disabled={path === '/software'} icon={faCodeBranch} iconBreakpoint={iconBreakpoint} />
        <LinkButton label='blog' href='/blog' disabled icon={faQuoteRight} iconBreakpoint={iconBreakpoint} />
    </div>;
}
