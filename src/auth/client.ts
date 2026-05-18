import { config } from '../config.js';
import type { LoginResponse, CachedToken } from './types.js';

let cached: CachedToken | null = null;
let inflight: Promise<string> | null = null;
const SAFETY_MARGIN_MS = 60_000;

export async function getAuthToken(forceRefresh = false): Promise<string> {
  if (!forceRefresh && cached && Date.now() < cached.expiresAt - SAFETY_MARGIN_MS) {
    return cached.sessionId;
  }
  if (inflight) return inflight;
  inflight = login().finally(() => { inflight = null; });
  return inflight;
}

export function invalidateAuthToken(): void {
  cached = null;
}

export function _resetAuthCacheForTests(): void {
  cached = null;
  inflight = null;
}

async function login(): Promise<string> {
  const res = await fetch(`${config.baseUrl}/api/external/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: config.username, password: config.password }),
  });
  if (res.status === 401) {
    throw new Error(
      'Peer39 login failed (401): check PEER39_USERNAME/PEER39_PASSWORD and that the account has the "External API" role.',
    );
  }
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Peer39 login failed (HTTP ${res.status}): ${body}`);
  }
  const body = (await res.json()) as LoginResponse;
  if (!body?.result?.sessionId || typeof body.expirationInSeconds !== 'number') {
    throw new Error('Peer39 login succeeded but response shape was unexpected.');
  }
  cached = {
    sessionId: body.result.sessionId,
    expiresAt: Date.now() + body.expirationInSeconds * 1000,
  };
  return cached.sessionId;
}
