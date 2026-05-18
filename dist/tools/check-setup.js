import { config } from '../config.js';
import { readRuntimeConfig } from '../runtime-config.js';
import { partnerIdToName } from '../partners.js';
import { CheckSetupInputSchema } from '../validation/schemas.js';
function annotatePartnerId(id) {
    if (typeof id !== 'number')
        return String(id);
    const name = partnerIdToName(id);
    return name ? `${id} (${name})` : String(id);
}
export const checkSetupTool = {
    name: 'peer39_check_setup',
    description: `Report current Peer39 MCP configuration: what's set, what's missing, and where to find each missing value. Run this when the user asks "is everything set up?" or before attempting a tool that fails with a missing-config error.

## Returns
A markdown-formatted report with each setting marked ✓ (set) or ✗ (missing). The source of each set value (env / runtime config) is shown. The actual username and password are never returned — only whether they are set.`,
    inputSchema: CheckSetupInputSchema,
    async handler() {
        const runtime = await readRuntimeConfig();
        const lines = ['# Peer39 MCP setup status', ''];
        const renderSecret = (label, value, src) => {
            if (value !== undefined && value !== null && value !== '') {
                lines.push(`- ✓ **${label}**: (set) *(from ${src})*`);
            }
            else {
                lines.push(`- ✗ **${label}**: not set`);
            }
        };
        const renderValue = (label, runtimeVal, envVal, where) => {
            if (runtimeVal !== undefined && runtimeVal !== null && runtimeVal !== '') {
                lines.push(`- ✓ **${label}**: \`${String(runtimeVal)}\` *(from runtime config)*`);
            }
            else if (envVal !== undefined && envVal !== null && envVal !== '') {
                lines.push(`- ✓ **${label}**: \`${String(envVal)}\` *(from env)*`);
            }
            else {
                lines.push(`- ✗ **${label}**: not set${where ? ` — find at ${where}` : ''}`);
            }
        };
        renderSecret('USERNAME', config.username, 'env');
        renderSecret('PASSWORD', config.password, 'env');
        renderValue('buyerId', runtime.buyerId, config.buyerId, 'https://app.peer39.com/accounts');
        renderValue('system', runtime.system, config.system, 'https://app.peer39.com/accounts (account page)');
        renderValue('userEmail', runtime.userEmail, config.userEmail, 'your work email is fine');
        const runtimePartnerLabel = runtime.defaultPartnerId !== undefined
            ? annotatePartnerId(runtime.defaultPartnerId)
            : undefined;
        const envPartnerLabel = config.defaultPartnerId !== undefined
            ? annotatePartnerId(config.defaultPartnerId)
            : undefined;
        renderValue('defaultPartnerId', runtimePartnerLabel, envPartnerLabel, 'https://app.peer39.com/partners');
        lines.push('');
        lines.push(`_Base URL: ${config.baseUrl}_`);
        lines.push(`_Runtime config file: ~/.peer39-mcp/config.json_`);
        lines.push('');
        lines.push('Use `peer39_configure` to save any missing values for next time.');
        return { content: [{ type: 'text', text: lines.join('\n') }] };
    },
};
//# sourceMappingURL=check-setup.js.map