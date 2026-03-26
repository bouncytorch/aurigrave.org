import Logo from '@/components/ui/logo/Logo';
import Footer from '@/components/layout/Footer';
import NavButtons from '@/components/layout/nav/NavButtons';
import Linktree from '@/components/layout/linktree/Linktree';
import YouTubeFrame from '@/components/ui/frame/YouTubeFrame';

import { LINKTREE_LINKS } from '@/lib/const';

import styles from './page.module.css';
export default function Home() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.body}>
                <main className={`${styles.main} reset-spacing`}>
                    <h1 style={{ margin: 0 }}><Logo /></h1>
                    <h2>bouncytorch</h2>
                    <NavButtons iconBreakpoint='300px' />
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
