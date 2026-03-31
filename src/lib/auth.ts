import { headers } from 'next/headers';

function getClientIp(h: Awaited<ReturnType<typeof headers>>): string | null {
    return h.get('cf-connecting-ip')
        ?? h.get('x-forwarded-for')?.split(',').pop()?.trim()
        ?? h.get('x-real-ip');
}

const WHITELIST = (process.env['ADMIN_IP_WHITELIST'] ?? '')
    .split(',')
    .map(ip => ip.trim())
    .filter(Boolean);

export async function requireAdmin(): Promise<void> {
    if (WHITELIST.length === 0)
        throw new Error('ADMIN_IP_WHITELIST is not configured');

    const ip = getClientIp(await headers());
    if (!ip || !WHITELIST.includes(ip))
        throw new Error('Unauthorized');
}
