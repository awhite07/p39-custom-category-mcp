import { config } from './config.js';
import { readRuntimeConfig } from './runtime-config.js';
import { MissingConfigError } from './api/errors.js';

export type Resolvable = 'buyerId' | 'system' | 'userEmail' | 'defaultPartnerId';

interface ResolvedTypeMap {
  buyerId: number;
  system: string;
  userEmail: string;
  defaultPartnerId: number;
}

const RESOLUTION_HINTS: Record<Resolvable, { what: string; where: string }> = {
  buyerId: {
    what: 'your Peer39 buyer ID (numeric account id)',
    where: 'https://app.peer39.com/accounts',
  },
  system: {
    what: 'your Peer39 "system name" (auto-generated, used for create-category calls)',
    where: 'https://app.peer39.com/accounts — shown on your account page',
  },
  userEmail: {
    what: 'your email address (attached to categories as "last updated by")',
    where: 'just use your work email',
  },
  defaultPartnerId: {
    what: 'the DSP partner id to publish categories to (numeric)',
    where: 'https://app.peer39.com/partners — or ask the LLM to use a name like "the-trade-desk" or "xandr"',
  },
};

function isPresent(v: unknown): boolean {
  return v !== undefined && v !== null && v !== '';
}

export async function resolve<K extends Resolvable>(
  key: K,
  override?: unknown,
): Promise<ResolvedTypeMap[K]> {
  if (isPresent(override)) return override as ResolvedTypeMap[K];

  const runtime = await readRuntimeConfig();
  const fromRuntime = (runtime as Record<string, unknown>)[key];
  if (isPresent(fromRuntime)) return fromRuntime as ResolvedTypeMap[K];

  const fromEnv = (config as Record<string, unknown>)[key];
  if (isPresent(fromEnv)) return fromEnv as ResolvedTypeMap[K];

  const hint = RESOLUTION_HINTS[key];
  throw new MissingConfigError(key, hint.what, hint.where);
}

export async function tryResolve<K extends Resolvable>(
  key: K,
  override?: unknown,
): Promise<ResolvedTypeMap[K] | undefined> {
  try {
    return await resolve(key, override);
  } catch (e) {
    if (e instanceof MissingConfigError) return undefined;
    throw e;
  }
}
