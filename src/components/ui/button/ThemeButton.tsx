'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrush } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from 'next-themes';

export default function ThemeButton() {
    const { resolvedTheme, setTheme } = useTheme();
    return (
        <button style={{ padding: '0.4em 0.4em' }} onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
            <FontAwesomeIcon icon={faBrush} />
        </button>
    );
}
