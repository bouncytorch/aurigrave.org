import type { Metadata } from 'next';
import './globals.css';
import { Archivo } from 'next/font/google';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

import { ThemeProvider } from 'next-themes';
import TransitionsEnabler from '@/components/misc/TransitionsEnabler';
import { LINKTREE_LINKS } from '@/lib/const';

const archivo = Archivo({ subsets: ['latin', 'latin-ext'], weight: 'variable', axes: ['wdth'], display:'swap' });

export const metadata: Metadata = {
    title: {
        template: '%s @ aurigrave group',
        default: 'aurigrave group'
    },
    authors: [
        { name: 'Taras Skrypniak', url: 'https://aurigrave.org' },
        { name: 'bouncytorch', url: 'https://aurigrave.org' }
    ],
    creator: 'bouncytorch',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    category: 'music',
    description: 'electronic, orchestral and ambient music, immature film, audio and sound design studies, web and game development discussions and updates.',
    keywords: [
        'bouncytorch', 'bobsytoch', 'bobsy', 'aurigrave', 'bouncytorch portfolio', 'music', 'producer', 'composer',
        'bouncytorch aurigrave', 'bouncytorch music', 'Taras Skrypniak music',
        'soundtrack', 'video', 'game', 'software', 'blog', 'sound design',
        'vgm', 'videogame', 'ost', 'original', 'chiptune', 'orchestral',
        'electronic', 'electronica', 'minecraft', 'ori', 'video game music',
        'Taras Skrypniak', 'Skrypniak', 'Taras'
    ],
    icons: [
        { rel: 'icon', type: 'image/ico', url: '/favicon.ico' }
    ],
    metadataBase: new URL('https://aurigrave.org'),
    alternates: {
        canonical: 'https://aurigrave.org',
    },
    twitter: {
        creator: '@bouncytorch'
    },
    formatDetection: {
        telephone: false,
        address: false,
        email: false,
    },
    openGraph: {
        images: [{ url: '/og-default.png', width: 1200, height: 630 }]
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <html lang="en" className={archivo.className} suppressHydrationWarning>
        <body>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Person',
                        name: 'bouncytorch',
                        alternateName: ['Taras Skrypniak', 'Skrypniak', 'bobsytoch', 'bobsy', 'aurigrave'],
                        url: 'https://aurigrave.org',
                        sameAs: LINKTREE_LINKS.map(v => v.link),
                        description: 'Electronic, orchestral and ambient music composer.',
                    }),
                }}
            />
            <ThemeProvider attribute={'class'} enableSystem>
                <TransitionsEnabler />
                {children}
            </ThemeProvider>
        </body>
    </html>;
}
