import 'server-only';

const CREDENTIALS = {
    user: process.env.COPYPARTY_USER,
    pass: process.env.COPYPARTY_PASS,
    addr: process.env.COPYPARTY_ADDR
};

export function getRelativeURL(remote: string) {
    return `${CREDENTIALS.addr!.replace(/\/$/, '')}/${remote.replace(/^\//, '')}`;
}

export async function uploadFile(file: File, remote: string, replace = false): Promise<{
    filesz: number;
    fileurl: string;
    sha512: string;
    sha_b64: string;
}> {
    const { user, pass, addr } = CREDENTIALS;

    // Compute SHA-512 of file before upload
    const buffer = await file.arrayBuffer();
    const hashBytes = new Uint8Array(await crypto.subtle.digest('SHA-512', buffer));

    // Full hex string
    const localHex = Array.from(hashBytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    // Full base64url string (no padding)
    let binary = '';
    hashBytes.forEach(b => { binary += String.fromCharCode(b); });
    const localB64 = btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    // PUT upload
    const url = `${addr!.replace(/\/$/, '')}/${remote.replace(/^\//, '')}`;
    const headers: { [key: string]: string } = {
        'PW': `${user}:${pass}`,
        'Accept': 'json',
    };
    if (replace) headers['Replace'] = '1';
    const res = await fetch(url, {
        method: 'PUT',
        headers,
        body: buffer,
    });


    if (!res.ok) {
        throw new Error(`Upload failed: HTTP ${res.status} ${res.statusText}`);
    }

    const data = await res.json() as {
        filesz: number;
        fileurl: string;
        sha512: string;
        sha_b64: string;
    };

    // Verify file size
    if (data.filesz !== file.size) {
        throw new Error(`File size mismatch - server: ${data.filesz}, local: ${file.size}`);
    }

    // Server returns truncated hashes; our full hash must start with theirs
    if (!localHex.startsWith(data.sha512)) {
        throw new Error(
            'SHA-512 mismatch!\n' +
            `Server: ${data.sha512}\n` +
            `Local:  ${localHex}`
        );
    }

    if (!localB64.startsWith(data.sha_b64)) {
        throw new Error(
            'SHA-512 (b64) mismatch!\n' +
            `Server: ${data.sha_b64}\n` +
            `Local:  ${localB64}`
        );
    }

    return data;
}
