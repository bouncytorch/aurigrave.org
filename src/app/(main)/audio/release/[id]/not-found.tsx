import Logo from '@/components/ui/logo/Logo';

export default function NotFound() {
    return <main style={{ padding: '15em 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Logo />
        <h1>NOT FOUND</h1>
        <p>Release doesn&apos;t exist. Click the logo to go back to the home page</p>
    </main>;
}
