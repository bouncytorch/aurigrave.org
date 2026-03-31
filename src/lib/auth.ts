import { headers } from 'next/headers';

function getClientIp(h: Awaited<ReturnType<typeof headers>>): string | null {
    return h.get('cf-connecting-ip')
        ?? h.get('x-forwarded-for')?.split(',').pop()?.trim()
        ?? h.get('x-real-ip');
}

export async function requireAdmin(): Promise<void> {
    const whitelist = (process.env['ADMIN_IP_WHITELIST'] ?? '')
        .split(',')
        .map(ip => ip.trim())
        .filter(Boolean);

    if (whitelist.length === 0)
        throw new Error('ADMIN_IP_WHITELIST is not configured');

    const ip = getClientIp(await headers());
    if (!ip || !whitelist.includes(ip))
        throw new Error('Unauthorized');
}
