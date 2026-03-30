import Logo from '../ui/logo/Logo';

export default function MainError({ title = 'NOT FOUND', desc = 'Page doesn\'t exist. Click the logo to go back to the home page' }) {
    return <main style={{ padding: '8em 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Logo />
        <h1>{title}</h1>
        <p>{desc}</p>
    </main>;
}
