import { getReleases } from '@/lib/releases';
import { Suspense } from 'react';
import ReleaseContent from './content';
import { Metadata } from 'next';
import Loading from '@/components/layout/Loading';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const release = (await getReleases()).find(v => v.id === id);
    return { title: release?.id ?? '?' };
}

export default function ReleasePage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <Suspense fallback={<Loading/>}>
            <ReleaseContent params={params} />
        </Suspense>
    );
}
