import Logo from '@/components/ui/logo/Logo';
import styles from './page.module.css';

export default function NotFound() {
    return <div className={styles.wrapper}>
        <div className={styles.body}>
            <main className={styles.main}>
                <Logo />
                <h1>NOT FOUND</h1>
                <p>Page doesn&apos;t exist. Click the logo to go back to the home page</p>
            </main>
        </div>
    </div>;
}
