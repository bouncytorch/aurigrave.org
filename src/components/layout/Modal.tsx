'use client';

import { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

const emptySubscribe = () => () => {};

export default function Modal({ children, onClose }: { children: React.ReactNode, onClose: () => void }) {
    const isClient = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );

    if (!isClient) return null;

    return createPortal(
        <div className={styles.modal_wrapper}>
            <div className={styles.modal}>
                <button className={styles.modal_close} onClick={onClose}>✕</button>
                {children}
            </div>
        </div>,
        document.body
    );
}
