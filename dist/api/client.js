import { config } from '../config.js';
import { getAuthToken, invalidateAuthToken } from '../auth/client.js';
import { Peer39ApiError } from './errors.js';
export async function request(opts, retry = true) {
    const token = await getAuthToken();
    const url = new URL(opts.path, config.baseUrl);
    if (opts.query) {
        for (const [k, v] of Object.entries(opts.query)) {
            if (v === undefined || v === null)
                continue;
            if (Array.isArray(v)) {
                for (const x of v)
                    url.searchParams.append(k, String(x));
            }
            else {
                url.searchParams.set(k, String(v));
            }
        }
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        ...opts.extraHeaders,
    };
    if (opts.body !== undefined)
        headers['Content-Type'] = 'application/json';
    const res = await fetch(url.toString(), {
        method: opts.method,
        headers,
        body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    });
    if (res.status === 401 && retry) {
        invalidateAuthToken();
        return request(opts, false);
    }
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        if (res.status === 401) {
            throw new Peer39ApiError(-401, 'Authentication failed after retry', `Authentication failed for ${opts.method} ${opts.path} after re-login. HTTP 401. Response: ${text}`);
        }
        throw new Error(`Peer39 API ${opts.method} ${opts.path} failed: HTTP ${res.status} ${text}`);
    }
    const body = (await res.json());
    if (opts.expectErrorCode !== false && typeof body.code === 'number' && body.code !== 0) {
        throw new Peer39ApiError(body.code, body.message ?? 'Unknown error');
    }
    return body;
}
//# sourceMappingURL=client.js.map