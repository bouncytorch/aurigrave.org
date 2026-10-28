export const dynamic = 'force-dynamic';

import ReleaseCardList from '@/components/layout/ReleaseCardList';
import { getReleases } from '@/lib/db/releases';
import { ReleaseType } from '@/models/Release';
import { Metadata } from 'next';

export const metadata: Metadata = { title: 'bobsy\'s audio' };

const SECTIONS: { label: string; type: ReleaseType | null }[] = [
    { label: 'GAME MUSIC',          type: ReleaseType.Game },
    { label: 'FILM MUSIC',          type: ReleaseType.Film },
    { label: 'SOUND DESIGN',        type: ReleaseType.SFX  },
    { label: 'STANDALONE RELEASES', type: null },
    { label: 'LEGACY RELEASES',     type: ReleaseType.Legacy }
];

export default async function Audio() {
    const releases = await getReleases();

    return (
        <main className='reset-spacing'>
            <h1>AUDIO</h1>
            { SECTIONS.map(({ label, type }) => {
                const filtered = releases.filter(v => v.type === type);
                if (!filtered.length) return null;
                return (
                    <section key={ label }>
                        <h2 style={{ padding:'0.2em 0' }}>{label}</h2>
                        <ReleaseCardList releases={filtered} />
                    </section>
                );
            }) }
        </main>
    );
}
