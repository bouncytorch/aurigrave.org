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
    title: {
        template: 'aurigrave/%s',
        default: 'aurigrave/?'
    },
    icons: [
        { rel: 'icon', type: 'image/ico', url: '/favicon.ico' }
    ]
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
