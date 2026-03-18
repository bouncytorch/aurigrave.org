import { getReleases } from '@/lib/releases';
import { Metadata, ResolvingMetadata } from 'next';
import Loading from '@/components/layout/Loading';

import Linktree, { Link } from '@/components/layout/linktree/Linktree';
import { faApple, faBandcamp, faSoundcloud, faSpotify, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { notFound } from 'next/navigation';
import YouTubeFrame from '@/components/ui/frame/YouTubeFrame';

import CoverImage from '@/components/ui/CoverImage';
import { Suspense } from 'react';

function getUrlBase(id: string, type: string | null, size: string) {
    if (type && type !== 'legacy') return `https://files.aurigrave.org/bouncytorch/Projects/previews/${type}/${id}/`;
    else return `https://files.aurigrave.org/bouncytorch/Projects/previews/other/${size}/${id}/`;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }, parent: ResolvingMetadata): Promise<Metadata> {
    const { id } = await params;
    const p = await parent;
    const release = (await getReleases()).find(v => v.id === id);
    if (release && p.keywords)
        return {
            title: release.name,
            description: release.description,
            keywords: [...release.genres, release.name.toLowerCase(), ...p.keywords],
            openGraph: {
                url: `https://aurigrave.org/audio/release/${release.id}`,
                images: [
                    {
                        url: getUrlBase(release.id, release.type, release.size) + 'cover.webp',
                        width: 500,
                        height: 500,
                        alt: `${release.name} cover art`,
                    },
                ],
            },
            twitter: {
                card: 'summary_large_image',
                images: [getUrlBase(release.id, release.type, release.size) + 'cover.webp'],
            },
            icons: [
                { rel: 'icon', type: 'image/webp', url: getUrlBase(release.id, release.type, release.size) + 'cover.webp' }
            ]
        };

    else return { title: 'Release not found' };
}

async function ReleaseContent({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const release = (await getReleases()).find(v => v.id === id);

    if (!release) return notFound();

    const baseUrl = getUrlBase(release.id, release.type, release.size);
    const links: Link[] = [];
    for (const link of release.linktree_urls) {
        if (link.includes('bandcamp.com'))
            links.push({ name: 'camp', icon: faBandcamp, link });
        else if (link.includes('soundcloud.com'))
            links.push({ name: 'cloud', icon: faSoundcloud, link });
        else if (link.includes('open.spotify.com'))
            links.push({ name: 'spotify', icon: faSpotify, link });
        else if (link.includes('youtube.com'))
            links.push({ name: 'youtube', icon: faYoutube, link });
        else if (link.includes('music.apple.com'))
            links.push({ name: 'apple', icon: faApple, link });
        else links.push({ name: new URL(link).hostname, icon: faGlobe, link });
    }

    return (
        <main style={{ paddingBottom:'1em' }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'MusicRelease',
                    'name': release.name,
                    'byArtist': {
                        '@type': 'MusicGroup',
                        'name': 'bouncytorch'
                    },
                    'datePublished': release.release_date,
                    'description': release.description,
                    'image': baseUrl + 'cover.webp',
                    'url': `https://aurigrave.org/audio/release/${release.id}`,
                    'genre': release.genres,
                } ) }}
            />

            <h1>{release.shortname.toUpperCase()}</h1>
            <h3>{release.name}</h3>
            <p style={{ opacity: 0.6, paddingTop: '0.1em', paddingBottom: '0.5em' }}>
                {release.genres.join(', ')} <br />
                {
                    release.release_date
                        ? new Date(release.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                        : '(TBA)'
                }
            </p>
            <p>{release.description}</p>
            <div style={{
                display: 'flex',
                gap: '1em',
                alignItems: 'center',
                paddingTop: '1em',
                justifyContent: 'center',
                flexWrap: 'wrap'
            }}>
                <CoverImage src={baseUrl + 'cover.webp'} alt={`${release.name} cover.`} size={400} style={{ filter: 'drop-shadow(0px 9px 14px #000000ce)', maxWidth: '400px' }} />
                <div style={{flex:'1', minWidth: '280px'}}>
                    <div style={{display:'flex',flexDirection:'column', gap: '1em', alignItems: 'center'}}>
                        { !!release.samples.length && <>
                            <h3>SAMPLES</h3>
                            {release.samples.map((sample) => <audio controls style={{width:'100%'}} key={sample}><source src={baseUrl + sample} /></audio>)}
                        </> }
                        { !!release.featured_video_url && <>
                            <h3>FEATURED VIDEO</h3>
                            <YouTubeFrame link={release.featured_video_url} />
                        </> }
                        {
                            !!release.linktree_urls.length && <>
                                <h3>LINKS</h3>
                                <Linktree links={links} />
                            </>
                        }
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function ReleasePage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <Suspense fallback={<Loading/>}>
            <ReleaseContent params={params} />
        </Suspense>
    );
}
