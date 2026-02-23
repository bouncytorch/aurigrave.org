import Footer from '@/components/layout/footer/Footer';
import Nav from '@/components/layout/nav/Nav';
import styles from './layout.module.css';

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
