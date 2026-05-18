import { GetCategoryInputSchema } from '../validation/schemas.js';
import { getCategory } from '../api/categories.js';
import { resolvePartnerId } from '../partners.js';
import { resolve } from '../resolve.js';
import type { ToolDefinition } from './index.js';
import { errorResult, formatToolError, jsonResult } from './index.js';

export const getCategoryTool: ToolDefinition = {
  name: 'peer39_get_category',
  description: `Fetch a single Peer39 Custom Category by its numeric ID.

## When to use
The user wants the details of one category — its items, language codes, partner, expiration, status, etc.

## Args
- accountCategoryId (required): numeric category ID
- partnerId (optional): DSP partner ID or friendly name (e.g. "the-trade-desk"); falls back to the saved default
- buyerId (optional): Peer39 buyer account ID; falls back to the saved default`,
  inputSchema: GetCategoryInputSchema,
  async handler(rawArgs) {
    const parsed = GetCategoryInputSchema.safeParse(rawArgs);
    if (!parsed.success) return errorResult(`Validation failed: ${parsed.error.message}`);
    try {
      const buyerId = await resolve('buyerId', parsed.data.buyerId);
      const partnerId = parsed.data.partnerId !== undefined
        ? resolvePartnerId(parsed.data.partnerId)
        : await resolve('defaultPartnerId');
      const res = await getCategory(parsed.data.accountCategoryId, partnerId, buyerId);
      return jsonResult(res);
    } catch (err) {
      return formatToolError(err);
    }
  },
};
