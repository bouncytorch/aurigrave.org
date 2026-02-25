import Logo from '@/components/ui/logo/Logo';
import Footer from '@/components/layout/Footer';
import NavButtons from '@/components/layout/nav/NavButtons';
import Linktree from '@/components/layout/linktree/Linktree';
import ThemeButton from '@/components/ui/button/ThemeButton';
import YouTubeFrame from '@/components/ui/frame/YouTubeFrame';

import { Metadata } from 'next';
import { LINKTREE_LINKS } from '@/lib/const';
export const metadata: Metadata = { title: 'home' };

import styles from './page.module.css';

export default function Home() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.body}>
                <main className={styles.main}>
                    <Logo />
                    <p>bouncytorch&apos;s linktree and portfolio page</p>
                    <NavButtons iconBreakpoint='300px' />
                    <p>portfolio reel:</p>
                    <YouTubeFrame link="https://www.youtube.com/embed/1jF1c8nP-JY"/>
                    <p>links:</p>
                    <Linktree links={LINKTREE_LINKS} />
                    <ThemeButton />
                    <Footer />
                </main>
            </div>
        </div>
    );
}
