import Loading from '@/components/layout/Loading';
import ReleaseCardList from '@/components/layout/ReleaseCardList';
import { getReleases } from '@/lib/releases';
import { ReleaseType } from '@/models/Release';
import { Metadata } from 'next';
import { connection } from 'next/server';
import { Suspense } from 'react';

export const metadata: Metadata = { title: { template: 'audio/%s', default: 'audio' } };

const SECTIONS: { label: string; type: ReleaseType | null }[] = [
    { label: 'GAME MUSIC',    type: ReleaseType.Game },
    { label: 'FILM MUSIC',    type: ReleaseType.Film },
    { label: 'SOUND DESIGN',  type: ReleaseType.SFX  },
    { label: 'OTHER RELEASES', type: null             },
];

async function AudioContent() {
    await connection();
    const releases = await getReleases();

    return (
        <main>
            <h1>AUDIO CREDITS</h1>
            {SECTIONS.map(({ label, type }) => {
                const filtered = releases.filter(v => v.type === type);
                if (!filtered.length) return null;
                return (
                    <section key={label}>
                        <h2>{label}</h2>
                        <ReleaseCardList releases={filtered} />
                    </section>
                );
            })}
        </main>
    );
}

export default function Audio() {
    return (
        <Suspense fallback={<Loading />}>
            <AudioContent />
        </Suspense>
    );
}
