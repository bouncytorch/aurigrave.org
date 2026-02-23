import { notFound } from 'next/navigation';
import { GAME_MUSIC } from '@/const';
import Image from 'next/image';
import { Metadata } from 'next';
import Linktree, { Link } from '@/components/layout/linktree/Linktree';
import { faApple, faBandcamp, faSoundcloud, faSpotify, faYoutube } from '@fortawesome/free-brands-svg-icons';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    console.log('peen')
  const { id } = await params;
  const album = GAME_MUSIC.find((a) => a.id === id);
  return { title: album?.id ?? '?' };
}

export default async function AlbumPage({ params }: Props) {
  const { id } = await params;
  const album = GAME_MUSIC.find((a) => a.id === id);

  if (!album) notFound();

  const links: Link[] = [];
  if (album.links.bandcamp) links.push({ icon: faBandcamp, name: 'camp', link: album.links.bandcamp })
  if (album.links.soundcloud) links.push({ icon: faSoundcloud, name: 'cloud', link: album.links.soundcloud })
  if (album.links.spotify) links.push({ icon: faSpotify, name: 'spotify', link: album.links.spotify })
  if (album.links.apple) links.push({ icon: faApple, name: 'apple', link: album.links.apple })
  if (album.links.youtube) links.push({ icon: faYoutube, name: 'youtube', link: album.links.youtube })

  return (
    <main style={{paddingBottom:'1em'}}>
      <h1 style={{paddingBottom:'0'}}>{album.fullname.toUpperCase()}</h1>
      <p style={{opacity: 0.6, paddingTop:'0', paddingBottom: '1em'}}>{album.genre}</p>
      <p>{album.description}</p>
      <div style={{
        display: 'flex',
        gap: '1em',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <Image src={album.cover} style={{
          width: '100%',
          height: '100%',
          maxWidth: '400px',
          aspectRatio:'1/1',
          filter: 'drop-shadow(0px 14px 7px #000000)'
        }} width={400} height={400} alt={`${album.fullname} cover`}/>
        <div style={{flex:'1'}}>
          <div style={{display:'flex',flexDirection:'column', gap: '1em', alignItems: 'center'}}>
            <h3>SAMPLES</h3>
            {album.samples.map((sample) => <audio controls style={{width:'100%'}} key={sample}><source src={sample} /></audio>)}
            <h3>LINKS</h3>
            <Linktree links={links} />
          </div>
        </div>
      </div>
    </main>
  );
}
