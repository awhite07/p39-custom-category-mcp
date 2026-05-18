import { UpdateCategoryItemsInputSchema } from '../validation/schemas.js';
import { updateItems } from '../api/categories.js';
import { resolvePartnerId } from '../partners.js';
import { resolve } from '../resolve.js';
import type { ToolDefinition } from './index.js';
import { errorResult, formatToolError, jsonResult } from './index.js';

export const updateCategoryItemsTool: ToolDefinition = {
  name: 'peer39_update_category_items',
  description: `Modify the items list (keywords / URLs / app IDs) of an existing Custom Category.

## CRITICAL: append behavior
By default this **APPENDS** new items to the existing list (\`append: true\`). To **REPLACE** the entire list, pass \`append: false\` — this is destructive.

Note: the Peer39 API itself defaults \`append=false\` (replace). This MCP server inverts the default for safety because accidental replacement is the worst failure mode.

## Args
- partnerCategoryId (required): numeric ID of the category
- items (required): non-empty array of items to add (or replace with, if append=false). Each ≤1024 chars.
- itemsTypes (optional): per-item REGULAR/MUST_HAVE/EXCLUDE. Length must equal items length.
- append (optional, default true): true = append; false = replace.
- partnerId, buyerId (optional): fall back to saved defaults.`,
  inputSchema: UpdateCategoryItemsInputSchema,
  async handler(rawArgs) {
    const parsed = UpdateCategoryItemsInputSchema.safeParse(rawArgs);
    if (!parsed.success) return errorResult(`Validation failed: ${parsed.error.message}`);
    const args = parsed.data;
    try {
      const buyerId = await resolve('buyerId', args.buyerId);
      const partnerId = args.partnerId !== undefined
        ? resolvePartnerId(args.partnerId)
        : await resolve('defaultPartnerId');
      const append = args.append === undefined ? true : args.append;
      const res = await updateItems({
        value: {
          partnerCategoryId: args.partnerCategoryId,
          buyerId,
          partnerId,
          items: args.items,
          ...(args.itemsTypes ? { itemsTypes: args.itemsTypes } : {}),
          append,
        },
      });
      if (append === false) {
        return {
          content: [
            { type: 'text', text: `[warning] append=false → existing items list was REPLACED.\n\n${JSON.stringify(res, null, 2)}` },
          ],
        };
      }
      return jsonResult(res);
    } catch (err) {
      return formatToolError(err);
    }
  },
};
