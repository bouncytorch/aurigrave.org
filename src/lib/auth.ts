import { headers } from 'next/headers';

const WHITELIST = (process.env.ADMIN_IP_WHITELIST ?? '')
    .split(',')
    .map(ip => ip.trim())
    .filter(Boolean);

function getClientIp(h: Awaited<ReturnType<typeof headers>>): string | null {
    const forwarded = h.get('x-forwarded-for');
    if (forwarded) {
        // On Vercel: only one value, this is fine.
        // On self-hosted behind nginx ($remote_addr): only one value, fine.
        // On misconfigured proxy: last value is the closest proxy - still
        // better than first which is trivially client-controlled.
        const ips = forwarded.split(',').map(s => s.trim());
        return ips[ips.length - 1];
    }
    return h.get('x-real-ip');
}

export async function requireAdmin(): Promise<void> {
    if (WHITELIST.length === 0)
        throw new Error('ADMIN_IP_WHITELIST is not configured');

    const ip = getClientIp(await headers());
    if (!ip || !WHITELIST.includes(ip))
        throw new Error('Unauthorized');
}
