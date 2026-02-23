'use client';

import { usePathname } from 'next/navigation';
import styles from './NavButtons.module.css';
import LinkButton from '@/components/ui/button/LinkButton'
import ThemeButton from '@/components/ui/button/ThemeButton';

export default function NavButtons() {
    const path = usePathname();
    return <div className={styles['nav-buttons']}>
        { path !== '/' && <ThemeButton /> }
        <LinkButton label='audio' href='/audio' disabled={path === '/audio'} />
        <LinkButton label='software' href='/software' disabled={path === '/software'} />
        <LinkButton label='blog' href='/blog' disabled />
    </div>
}
