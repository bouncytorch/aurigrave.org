import Release from '@/models/Release';
import { cacheLife } from 'next/cache';

export async function getReleases() {
    'use cache';
    cacheLife('hours');
    return (await Release.findAll()).map(v => v.toJSON());
}
