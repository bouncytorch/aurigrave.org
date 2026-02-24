import Linktree, { Link } from '@/components/layout/linktree/Linktree';
import { getReleases } from '@/lib/releases';
import { faApple, faBandcamp, faSoundcloud, faSpotify, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { notFound } from 'next/navigation';
import Image from 'next/image';

export default async function ReleaseContent({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const release = (await getReleases()).find(v => v.id === id);

    if (!release) return notFound();

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
                <Image src={release.cover_url} style={{
                    width: '100%',
                    height: '100%',
                    maxWidth: '400px',
                    aspectRatio:'1/1',
                    filter: 'drop-shadow(0px 14px 7px #000000)'
                }} width={400} height={400} alt={`${release.name} cover`}/>
                <div style={{flex:'1'}}>
                    <div style={{display:'flex',flexDirection:'column', gap: '1em', alignItems: 'center'}}>
                        <h3>SAMPLES</h3>
                        {release.sample_urls.map((sample) => <audio controls style={{width:'100%'}} key={sample}><source src={sample} /></audio>)}
                        <h3>LINKS</h3>
                        <Linktree links={links} />
                    </div>
                </div>
            </div>
        </main>
    );
}
