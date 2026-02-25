import style from './Nav.module.css';
import Logo from '@/components/ui/logo/Logo';
import NavButtons from './NavButtons';
import { Suspense } from 'react';

export default function Nav() {
    return <nav className={style.nav}>
        <Logo />
        <Suspense fallback={<div className={style['nav-buttons']} />}>
            <NavButtons iconBreakpoint='515px' />
        </Suspense>
    </nav>;
}
