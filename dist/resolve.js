import { config } from './config.js';
import { readRuntimeConfig } from './runtime-config.js';
import { MissingConfigError } from './api/errors.js';
const RESOLUTION_HINTS = {
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
function isPresent(v) {
    return v !== undefined && v !== null && v !== '';
}
export async function resolve(key, override) {
    if (isPresent(override))
        return override;
    const runtime = await readRuntimeConfig();
    const fromRuntime = runtime[key];
    if (isPresent(fromRuntime))
        return fromRuntime;
    const fromEnv = config[key];
    if (isPresent(fromEnv))
        return fromEnv;
    const hint = RESOLUTION_HINTS[key];
    throw new MissingConfigError(key, hint.what, hint.where);
}
export async function tryResolve(key, override) {
    try {
        return await resolve(key, override);
    }
    catch (e) {
        if (e instanceof MissingConfigError)
            return undefined;
        throw e;
    }
}
//# sourceMappingURL=resolve.js.map