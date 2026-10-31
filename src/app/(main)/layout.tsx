import Footer from '@/components/layout/Footer';
import Nav from '@/components/layout/nav/Nav';
import styles from './layout.module.css';

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className={styles.main}>
            <Nav />
            {children}
            <Footer />
        </main>
    );
}
