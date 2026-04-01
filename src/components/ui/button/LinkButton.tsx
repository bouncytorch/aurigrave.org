import Link from 'next/link';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import styles from './LinkButton.module.css';

export default function LinkButton({
    label,
    href,
    disabled = false,
    icon,
}: {
    label: React.ReactNode;
    href: string;
    disabled?: boolean;
    icon?: IconDefinition;
}) {
    const content = icon ? (
        <div className={styles['button-content']}>
            <span className={styles['label-view']}>
                {label}
            </span>
        </div>
    ) : label;

    return disabled
        ? <button disabled>{content}</button>
        : <Link href={href}><button>{content}</button></Link>;
}
