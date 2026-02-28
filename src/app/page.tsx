import Logo from '@/components/ui/logo/Logo';
import Footer from '@/components/layout/Footer';
import NavButtons from '@/components/layout/nav/NavButtons';
import Linktree from '@/components/layout/linktree/Linktree';
import ThemeButton from '@/components/ui/button/ThemeButton';
import YouTubeFrame from '@/components/ui/frame/YouTubeFrame';

import { LINKTREE_LINKS } from '@/lib/const';

import styles from './page.module.css';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.body}>
                <main className={styles.main}>
                    <h1><Logo /></h1>
                    <p>currently serving as bouncytorch&apos;s linktree and portfolio page</p>
                    <NavButtons iconBreakpoint='300px' />
                    <p>portfolio reel:</p>
                    <YouTubeFrame link="https://www.youtube.com/embed/1jF1c8nP-JY"/>
                    <p>links:</p>
                    <h3>bouncytorch</h3>
                    <Linktree links={LINKTREE_LINKS} />
                    <h3>cmayk</h3>
                    <Linktree links={[{ name: 'oxirian.net', icon: faGlobe, link: 'https://oxirian.net'  }]}></Linktree>
                    <ThemeButton />
                    <Footer />
                </main>
            </div>
        </div>
    );
}
