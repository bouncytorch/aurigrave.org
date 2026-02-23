'use client';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './LinktreeButton.module.css';

export default function LinktreeButton({ label, href, icon, disabled = false }: { label: string, href: string, icon: IconDefinition, disabled?: boolean }) {
    const btn = <button className={style['linktree-button']}>
        <FontAwesomeIcon icon={icon} />
        <span>{ label }</span>
    </button>

    if (disabled) return btn
    else return <a href={href} className={style['linktree-link']}>{btn}</a>
}
