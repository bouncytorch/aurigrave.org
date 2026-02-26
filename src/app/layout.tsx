import type { Metadata } from 'next';
import './globals.css';
import { Archivo } from 'next/font/google';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

import { ThemeProvider } from 'next-themes';
import TransitionsEnabler from '@/components/misc/TransitionsEnabler';

const archivo = Archivo({ subsets: ['latin', 'latin-ext'], weight: 'variable', display:'swap' });

export const metadata: Metadata = {
    title: 'aurigrave',
    description: 'electronic, orchestral and ambient music, immature film, audio and sound design studies, web and game development discussions and updates.',
    keywords: [
        'bouncytorch', 'aurigrave', 'music', 'producer', 'composer',
        'soundtrack', 'video', 'game', 'software', 'blog', 'sound design',
        'vgm', 'videogame', 'ost', 'original', 'chiptune', 'orchestral',
        'electronic', 'electronica'
    ],
    icons: [
        { rel: 'icon', type: 'image/ico', url: '/favicon.ico' }
    ],
    metadataBase: new URL('https://aurigrave.org' ),
    alternates: {
        canonical: '/',
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <html lang="en" className={archivo.className} suppressHydrationWarning>
        <body>
            <ThemeProvider attribute={'class'} enableSystem>
                <TransitionsEnabler />
                {children}
            </ThemeProvider>
        </body>
    </html>;
}
