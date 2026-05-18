import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { z } from 'zod';

const DEFAULT_DIR = join(homedir(), '.peer39-mcp');
const DEFAULT_FILE = join(DEFAULT_DIR, 'config.json');

// Allow override for tests. Read at function-call time so tests can swap HOME.
function paths(): { dir: string; file: string } {
  const override = process.env.PEER39_MCP_CONFIG_DIR;
  if (override) {
    return { dir: override, file: join(override, 'config.json') };
  }
  // Re-resolve from current HOME so tests that swap HOME see the new path.
  const home = process.env.HOME ?? homedir();
  const dir = join(home, '.peer39-mcp');
  return { dir, file: join(dir, 'config.json') };
}

export const RuntimeConfigSchema = z.object({
  buyerId: z.number().int().positive().optional(),
  system: z.string().min(1).optional(),
  userEmail: z.string().email().optional(),
  defaultPartnerId: z.number().int().positive().optional(),
});

export type RuntimeConfig = z.infer<typeof RuntimeConfigSchema>;

let cache: RuntimeConfig | null = null;

export async function readRuntimeConfig(): Promise<RuntimeConfig> {
  if (cache) return cache;
  const { file } = paths();
  try {
    const raw = await readFile(file, 'utf8');
    cache = RuntimeConfigSchema.parse(JSON.parse(raw));
  } catch (e: unknown) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') {
      cache = {};
    } else {
      throw new Error(`Failed to read runtime config at ${file}: ${err.message ?? String(e)}`);
    }
  }
  return cache!;
}

export async function updateRuntimeConfig(patch: Partial<RuntimeConfig>): Promise<RuntimeConfig> {
  const current = await readRuntimeConfig();
  const merged = RuntimeConfigSchema.parse({ ...current, ...patch });
  const { dir, file } = paths();
  await mkdir(dir, { recursive: true, mode: 0o700 });
  const tmp = `${file}.tmp`;
  await writeFile(tmp, JSON.stringify(merged, null, 2), { mode: 0o600 });
  await rename(tmp, file);
  cache = merged;
  return merged;
}

export function _resetCacheForTests(): void {
  cache = null;
}

export function _runtimeConfigPathsForTests(): { dir: string; file: string } {
  return paths();
}
