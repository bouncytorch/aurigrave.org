'use client';

import Link from 'next/link';

export default function LinkButton({ label, href, disabled = false }: { label: string, href: string, disabled?: boolean }) {
    return disabled
        ? <button disabled>{ label }</button>
        : <Link href={href}><button>{ label }</button></Link>
}
