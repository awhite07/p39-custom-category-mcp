import { UpdateCategoryDetailsInputSchema } from '../validation/schemas.js';
import { updateBasicDetails } from '../api/categories.js';
import { resolvePartnerId } from '../partners.js';
import { resolve } from '../resolve.js';
import type { ToolDefinition } from './index.js';
import { errorResult, formatToolError, jsonResult } from './index.js';

export const updateCategoryDetailsTool: ToolDefinition = {
  name: 'peer39_update_category_details',
  description: `Update a Custom Category's metadata (name, type, description, language codes, expiration, email). Does NOT touch the items list — use peer39_update_category_items for that, or peer39_update_category for an all-in-one update.

## Args
- partnerCategoryId (required): numeric ID of the category to update
- partnerId (optional): DSP partner ID or friendly name; falls back to saved default
- buyerId (optional): falls back to saved default
- categoryName, type, description, expirationDate, emailAddress, languageCodes: any subset to change`,
  inputSchema: UpdateCategoryDetailsInputSchema,
  async handler(rawArgs) {
    const parsed = UpdateCategoryDetailsInputSchema.safeParse(rawArgs);
    if (!parsed.success) return errorResult(`Validation failed: ${parsed.error.message}`);
    const args = parsed.data;
    try {
      const buyerId = await resolve('buyerId', args.buyerId);
      const partnerId = args.partnerId !== undefined
        ? resolvePartnerId(args.partnerId)
        : await resolve('defaultPartnerId');
      const res = await updateBasicDetails({
        value: {
          partnerCategoryId: args.partnerCategoryId,
          buyerId,
          partnerId,
          ...(args.categoryName !== undefined ? { categoryName: args.categoryName } : {}),
          ...(args.type !== undefined ? { type: args.type } : {}),
          ...(args.description !== undefined ? { description: args.description } : {}),
          ...(args.emailAddress !== undefined ? { emailAddress: args.emailAddress } : {}),
          ...(args.expirationDate !== undefined ? { expirationDate: args.expirationDate } : {}),
          ...(args.languageCodes !== undefined ? { languageCodes: args.languageCodes } : {}),
        },
      });
      return jsonResult(res);
    } catch (err) {
      return formatToolError(err);
    }
  },
};
