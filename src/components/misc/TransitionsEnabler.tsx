'use client';
import { useEffect } from 'react';

export default function TransitionsEnabler() {
    useEffect(() => {
        document.body.classList.add('transitions-enabled');
    }, []);

    return null;
}
