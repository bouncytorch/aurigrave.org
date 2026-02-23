import style from './Nav.module.css'
import Logo from '@/components/ui/logo/Logo'
import NavButtons from './NavButtons'

export default function Nav() {
    return <nav className={style.nav}>
        <Logo />
        <NavButtons />
    </nav>
}
