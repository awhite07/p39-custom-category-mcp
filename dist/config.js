import 'dotenv/config';
import { z } from 'zod';
const EMPTY_TO_UNDEFINED = (key) => {
    const v = process.env[key];
    if (v === undefined)
        return undefined;
    const trimmed = v.trim();
    return trimmed === '' ? undefined : trimmed;
};
const ConfigSchema = z.object({
    username: z.string().min(1, 'PEER39_USERNAME is required'),
    password: z.string().min(1, 'PEER39_PASSWORD is required'),
    buyerId: z.coerce.number().int().positive().optional(),
    system: z.string().min(1).optional(),
    userEmail: z.string().email().optional(),
    defaultPartnerId: z.coerce.number().int().positive().optional(),
    baseUrl: z.string().url().default('https://app.peer39.com'),
});
const ENV_VAR_NAMES = {
    username: 'PEER39_USERNAME',
    password: 'PEER39_PASSWORD',
    buyerId: 'PEER39_BUYER_ID',
    system: 'PEER39_SYSTEM',
    userEmail: 'PEER39_USER_EMAIL',
    defaultPartnerId: 'PEER39_DEFAULT_PARTNER_ID',
    baseUrl: 'PEER39_BASE_URL',
};
function loadConfig() {
    const raw = {
        username: EMPTY_TO_UNDEFINED('PEER39_USERNAME'),
        password: EMPTY_TO_UNDEFINED('PEER39_PASSWORD'),
        buyerId: EMPTY_TO_UNDEFINED('PEER39_BUYER_ID'),
        system: EMPTY_TO_UNDEFINED('PEER39_SYSTEM'),
        userEmail: EMPTY_TO_UNDEFINED('PEER39_USER_EMAIL'),
        defaultPartnerId: EMPTY_TO_UNDEFINED('PEER39_DEFAULT_PARTNER_ID'),
        baseUrl: EMPTY_TO_UNDEFINED('PEER39_BASE_URL'),
    };
    const parsed = ConfigSchema.safeParse(raw);
    if (!parsed.success) {
        console.error('[peer39-mcp] FATAL: invalid configuration. Set the missing/malformed env vars in your `.env` file or Claude Desktop config.\n');
        for (const issue of parsed.error.issues) {
            const path = issue.path[0];
            const envName = path ? ENV_VAR_NAMES[path] ?? String(path) : '(unknown)';
            console.error(`  - ${envName}: ${issue.message}`);
        }
        console.error('\nOnly PEER39_USERNAME and PEER39_PASSWORD are required at startup. Everything else can be set later via the `peer39_configure` tool or per-call tool args.');
        process.exit(1);
    }
    return Object.freeze(parsed.data);
}
export const config = loadConfig();
export const __ENV_VAR_NAMES = ENV_VAR_NAMES;
//# sourceMappingURL=config.js.map