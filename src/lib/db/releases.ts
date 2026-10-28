'use server';

import Release from '@/models/Release';

export async function getReleases() {
    return (await Release.findAll()).map(v => v.toJSON());
}
