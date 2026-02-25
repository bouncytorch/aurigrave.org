'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useEffect, useState } from 'react';

// TODO: This probably tanks performance, need to figure out if I can replace this

export default function LinkButton({
    label,
    href,
    disabled = false,
    icon,
    iconBreakpoint,
}: {
    label: React.ReactNode;
    href: string;
    disabled?: boolean;
    icon?: IconDefinition;
    iconBreakpoint?: string;
}) {
    const [showIcon, setShowIcon] = useState(false);

    useEffect(() => {
        if (!icon || !iconBreakpoint) return;
        const mq = window.matchMedia(`(max-width: ${iconBreakpoint})`);
        const handler = (e: MediaQueryListEvent) => setShowIcon(e.matches);
        mq.addEventListener('change', handler);
        const raf = requestAnimationFrame(() => setShowIcon(mq.matches));
        return () => {
            mq.removeEventListener('change', handler);
            cancelAnimationFrame(raf);
        };
    }, [icon, iconBreakpoint]);


    const content = icon && iconBreakpoint
        ? (showIcon ? <FontAwesomeIcon icon={icon} /> : label)
        : label;

    return disabled
        ? <button disabled>{content}</button>
        : <Link href={href}><button>{content}</button></Link>;
}
