import Release from '@/models/Release';
import { cacheLife } from 'next/cache';

export async function getReleases() {
    'use cache';
    if (process.env.NODE_ENV === 'development') cacheLife('seconds');
    else cacheLife('hours');
    return (await Release.findAll()).map(v => v.toJSON());
}
