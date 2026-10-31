import { getReleases } from '@/lib/db/releases';
import { Metadata, ResolvingMetadata } from 'next';
import Loading from '@/components/layout/Loading';

import Linktree, { Link } from '@/components/layout/linktree/Linktree';
import { faApple, faBandcamp, faSoundcloud, faSpotify, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { notFound } from 'next/navigation';
import YouTubeFrame from '@/components/ui/frame/YouTubeFrame';

import Markdown from 'react-markdown';

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

    if (release && p.keywords) {
        const baseUrl = getUrlBase(release.id, release.type, release.size);
        return {
            title: release.name,
            description: release.description,
            keywords: [...release.genres, release.shortname.toLowerCase(), release.name.toLowerCase(), ...p.keywords],
            alternates: {
                canonical: `/audio/release/${release.id}`,
            },
            openGraph: {
                type: 'music.album',
                url: `/audio/release/${release.id}`,
                siteName: 'aurigrave group',
                locale: 'en_US',
                images: [
                    {
                        url: getUrlBase(release.id, release.type, release.size) + 'cover.webp',
                        width: 500,
                        height: 500,
                        alt: `${release.name} cover art`,
                    },
                ],
                audio: [...release.samples.map((sample) => baseUrl + sample)]
            },
            twitter: {
                card: 'summary_large_image',
                images: [baseUrl + 'cover.webp'],
            },
            icons: [
                { rel: 'icon', type: 'image/webp', url: getUrlBase(release.id, release.type, release.size) + 'cover.webp' }
            ]
        };
    }

    else return notFound();
}

async function ReleaseContent({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const release = (await getReleases()).find(v => v.id === id);

    if (!release) return notFound();

    const baseUrl = getUrlBase(release.id, release.type, release.size);
    const links: Link[] = [];
    // I don't care if this formatting is diabolic, deal with it
    for (const link of release.linktree_urls)
        if      (link.includes('bandcamp.com'))     links.push({ name: 'camp',                 icon: faBandcamp,   link });
        else if (link.includes('soundcloud.com'))   links.push({ name: 'cloud',                icon: faSoundcloud, link });
        else if (link.includes('open.spotify.com')) links.push({ name: 'spotify',              icon: faSpotify,    link });
        else if (link.includes('youtube.com'))      links.push({ name: 'youtube',              icon: faYoutube,    link });
        else if (link.includes('music.apple.com'))  links.push({ name: 'apple',                icon: faApple,      link });
        else                                        links.push({ name: new URL(link).hostname, icon: faGlobe,      link });


    return (
        <main className='reset-spacing'>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': ['MusicRelease', 'MusicAlbum'],  // dual type for broader matching
                    name: release.name,
                    byArtist: {
                        '@type': 'Person',
                        name: 'bouncytorch',
                        url: 'https://aurigrave.org',
                    },
                    datePublished: release.release_date,
                    description: release.description,
                    image: baseUrl + 'cover.webp',
                    url: `https://aurigrave.org/audio/release/${release.id}`,
                    genre: release.genres,
                    sameAs: links.map(v => v.link),
                    offers: links
                        .filter(l => ['spotify', 'camp', 'apple', 'youtube', 'cloud'].includes(l.name))
                        .map(l => ({
                            '@type': 'Offer',
                            url: l.link,
                        })),
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
            <Markdown>{release.description}</Markdown>
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
