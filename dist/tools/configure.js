import { ConfigureInputSchema } from '../validation/schemas.js';
import { updateRuntimeConfig } from '../runtime-config.js';
import { resolvePartnerId } from '../partners.js';
import { errorResult, formatToolError } from './index.js';
export const configureTool = {
    name: 'peer39_configure',
    description: `Save Peer39 settings that the MCP server needs (buyer ID, system name, default email, default partner) so you don't have to re-supply them every call. Values persist to ~/.peer39-mcp/config.json.

## When to use
- The user shares their buyer ID, system name, email, or preferred DSP in conversation — save it so future tool calls work without prompting again.
- The user wants to switch the default DSP for new categories.

## Args (all optional, but pass at least one)
- buyerId: numeric Peer39 account id — find at https://app.peer39.com/accounts
- system: the system name auto-generated for the account — find at https://app.peer39.com/accounts
- userEmail: your email address — attached to categories you create as "last updated by"
- defaultPartnerId: numeric DSP id OR a friendly name like "the-trade-desk", "xandr", "basis"`,
    inputSchema: ConfigureInputSchema,
    async handler(rawArgs) {
        const parsed = ConfigureInputSchema.safeParse(rawArgs);
        if (!parsed.success) {
            return errorResult(`Validation failed: ${parsed.error.message}`);
        }
        try {
            const patch = {};
            if (parsed.data.buyerId !== undefined)
                patch.buyerId = parsed.data.buyerId;
            if (parsed.data.system !== undefined)
                patch.system = parsed.data.system;
            if (parsed.data.userEmail !== undefined)
                patch.userEmail = parsed.data.userEmail;
            if (parsed.data.defaultPartnerId !== undefined) {
                patch.defaultPartnerId = resolvePartnerId(parsed.data.defaultPartnerId);
            }
            const merged = await updateRuntimeConfig(patch);
            return {
                content: [{ type: 'text', text: `Saved. Current persisted runtime config:\n${JSON.stringify(merged, null, 2)}` }],
            };
        }
        catch (err) {
            return formatToolError(err);
        }
    },
};
//# sourceMappingURL=configure.js.map