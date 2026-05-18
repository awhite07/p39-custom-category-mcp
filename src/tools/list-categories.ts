import { ListCategoriesInputSchema } from '../validation/schemas.js';
import { listCategories } from '../api/categories.js';
import { resolve, tryResolve } from '../resolve.js';
import type { ToolDefinition } from './index.js';
import { errorResult, formatToolError, jsonResult } from './index.js';

export const listCategoriesTool: ToolDefinition = {
  name: 'peer39_list_categories',
  description: `List Peer39 Custom Categories for the configured buyer (or one you pass explicitly).

## When to use
The user wants to see which custom categories exist on their account, optionally filtered.

## Defaults & gotchas
- If no \`buyer\` is passed, falls back to the saved default buyer ID.
- If no \`partner\` is passed, falls back to the saved default partner ID.
- Peer39 API quirk: server-side defaults are \`start=50\` and \`max=0\`, which return zero results. **Always pass \`start: 0\` and \`max\` (e.g. \`max: 50\`) explicitly** unless you have a reason not to.

## Args
- buyer (optional): array of buyer IDs; defaults to [savedBuyerId]
- partner (optional): array of partner IDs; defaults to [savedDefaultPartnerId]
- max (optional, 1–999): page size
- start (optional, >= 0): offset
- sort, filterProperty, filterValue, filterRange: passed through unchanged`,
  inputSchema: ListCategoriesInputSchema,
  async handler(rawArgs) {
    const parsed = ListCategoriesInputSchema.safeParse(rawArgs);
    if (!parsed.success) return errorResult(`Validation failed: ${parsed.error.message}`);
    try {
      let buyer = parsed.data.buyer;
      if (!buyer || buyer.length === 0) {
        const defaultBuyer = await tryResolve('buyerId');
        if (defaultBuyer !== undefined) buyer = [defaultBuyer];
      }
      let partner = parsed.data.partner;
      if (!partner || partner.length === 0) {
        const defaultPartner = await tryResolve('defaultPartnerId');
        if (defaultPartner !== undefined) partner = [defaultPartner];
      }

      if (!buyer || buyer.length === 0) {
        // force a friendly error
        await resolve('buyerId');
      }

      const res = await listCategories({
        buyer,
        partner,
        max: parsed.data.max,
        start: parsed.data.start,
        sort: parsed.data.sort,
        filterProperty: parsed.data.filterProperty,
        filterValue: parsed.data.filterValue,
        filterRange: parsed.data.filterRange,
      });
      return jsonResult(res);
    } catch (err) {
      return formatToolError(err);
    }
  },
};
