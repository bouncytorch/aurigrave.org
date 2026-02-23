'use client'
import Link from 'next/link';
import styles from './Album.module.css';

import Image from 'next/image'

export type AlbumType = {
    id: string,
    shortname: string,
    fullname: string,
    genre: string,
    description: string,
    cover: string,
    samples: string[],
    links: {
        bandcamp?: string,
        spotify?: string,
        apple?: string,
        soundcloud?: string,
        youtube?: string
    }
}

export function Album({ album }: { album: AlbumType }) {
    return <Link className={styles.albumLink} href={`/audio/album/${album.id}`}>
        <button className={styles.album}>
        <Image src={album.cover} width={220} height={220} alt={`${album.fullname} cover`}/>
        <span style={{ fontSize: '0.8em', opacity: 0.7 }}>{album.genre}</span>
        <span>{album.shortname}</span>
    </button>
    </Link>
}


export default function AlbumList({ albums }: { albums: AlbumType[] }) {
    return <div style={{display:'flex', gap:'0.4em', flexWrap: 'wrap', paddingBottom:'1em', justifyContent: 'space-evenly',}}>
        {albums.map((album) => <Album key={album.shortname} album={album}/>)}
    </div>
}
