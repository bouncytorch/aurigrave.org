import { Metadata } from 'next';
import AlbumList from '@/components/layout/audio/AlbumList';
import { GAME_MUSIC } from '@/const';
export const metadata: Metadata = { title: 'audio' }

export default function Audio() {
    return <main>
        <h1>GAME MUSIC</h1>
        <AlbumList albums={GAME_MUSIC}/>
    </main>
}
