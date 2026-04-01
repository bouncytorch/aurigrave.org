import Logo from '@/components/ui/logo/Logo';
import Footer from '@/components/layout/Footer';
import NavButtons from '@/components/layout/nav/NavButtons';
import Linktree from '@/components/layout/linktree/Linktree';
import YouTubeFrame from '@/components/ui/frame/YouTubeFrame';
import styles from './page.module.css';
import { Metadata } from 'next';

import { LINKTREE_LINKS } from '@/lib/const';

export const metadata: Metadata = { title: 'bouncytorch' };

export default function Home() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.body}>
                <main className={`${styles.main} reset-spacing`}>
                    <h1 style={{ margin: 0 }}><Logo /></h1>
                    <h2>bouncytorch</h2>
                    <NavButtons />
                    <p>portfolio reel:</p>
                    <YouTubeFrame link="https://www.youtube.com/embed/1jF1c8nP-JY"/>
                    <p>links:</p>
                    <Linktree links={LINKTREE_LINKS} />
                    <Footer />
                </main>
            </div>
        </div>
    );
}
