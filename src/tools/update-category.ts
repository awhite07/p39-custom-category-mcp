import { UpdateCategoryInputSchema } from '../validation/schemas.js';
import { updateCategory } from '../api/categories.js';
import { resolvePartnerId } from '../partners.js';
import { resolve } from '../resolve.js';
import type { ToolDefinition } from './index.js';
import { errorResult, formatToolError, jsonResult } from './index.js';

export const updateCategoryTool: ToolDefinition = {
  name: 'peer39_update_category',
  description: `"Update all" — replace the entire definition of a Custom Category in one call (name, type, items, items types, safeFrom, email, expiration, language codes, description, advertiser ID).

## When to use
You want to make several changes at once. For a single-field tweak, prefer peer39_update_category_details or peer39_update_category_items so you don't accidentally clobber other fields.

## Args
- partnerCategoryId (required): numeric ID of the category to update
- partnerId (optional): falls back to saved default
- buyerId (optional): falls back to saved default
- Any of: categoryName, type, items, itemsTypes, safeFrom, emailAddress, expirationDate, languageCodes, description, advertiserId`,
  inputSchema: UpdateCategoryInputSchema,
  async handler(rawArgs) {
    const parsed = UpdateCategoryInputSchema.safeParse(rawArgs);
    if (!parsed.success) return errorResult(`Validation failed: ${parsed.error.message}`);
    const args = parsed.data;
    try {
      const buyerId = await resolve('buyerId', args.buyerId);
      const partnerId = args.partnerId !== undefined
        ? resolvePartnerId(args.partnerId)
        : await resolve('defaultPartnerId');
      const res = await updateCategory({
        value: {
          partnerCategoryId: args.partnerCategoryId,
          buyerId,
          partner: {
            id: partnerId,
            ...(args.advertiserId ? { dspData: { advertiserId: args.advertiserId } } : {}),
          },
          ...(args.categoryName !== undefined ? { categoryName: args.categoryName } : {}),
          ...(args.type !== undefined ? { type: args.type } : {}),
          ...(args.items !== undefined ? { items: args.items } : {}),
          ...(args.itemsTypes !== undefined ? { itemsTypes: args.itemsTypes } : {}),
          ...(args.safeFrom !== undefined ? { safeFrom: args.safeFrom } : {}),
          ...(args.emailAddress !== undefined ? { emailAddress: args.emailAddress } : {}),
          ...(args.expirationDate !== undefined ? { expirationDate: args.expirationDate } : {}),
          ...(args.languageCodes !== undefined ? { languageCodes: args.languageCodes } : {}),
          ...(args.description !== undefined ? { description: args.description } : {}),
        },
      });
      return jsonResult(res);
    } catch (err) {
      return formatToolError(err);
    }
  },
};
