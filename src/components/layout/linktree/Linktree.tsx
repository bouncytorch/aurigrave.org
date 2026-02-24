import Link from 'next/link';
import LinktreeButton from '@/components/ui/button/LinktreeButton';

import style from './Linktree.module.css';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type Link = {
    name: string
    link: string
    icon: IconDefinition
};

export default function Linktree({ links }: { links: Link[] }) {
    return <div className={style.linktree}>
        { links.map((link) => (
            <LinktreeButton key={link.link} label={link.name} href={link.link} icon={link.icon} />
        )) }
    </div>;
}
