import { DeleteCategoryInputSchema } from '../validation/schemas.js';
import { deleteCategory } from '../api/categories.js';
import { resolve } from '../resolve.js';
import { errorResult, formatToolError, jsonResult } from './index.js';
export const deleteCategoryTool = {
    name: 'peer39_delete_category',
    description: `Delete one or more Peer39 Custom Categories by ID. Batch operation — pass an array.

## CRITICAL
This is destructive and irreversible from the API. Confirm with the user before calling.

## Args
- categories (required): array of { partnerCategoryId, buyerId? }. buyerId falls back to the saved default per entry.

## Note
The underlying Peer39 endpoint uses HTTP PUT (not DELETE) and a batch body. This tool wraps that detail.`,
    inputSchema: DeleteCategoryInputSchema,
    async handler(rawArgs) {
        const parsed = DeleteCategoryInputSchema.safeParse(rawArgs);
        if (!parsed.success)
            return errorResult(`Validation failed: ${parsed.error.message}`);
        try {
            const defaultBuyerId = await resolve('buyerId');
            const entries = parsed.data.categories.map((c) => ({
                partnerCategoryId: c.partnerCategoryId,
                buyerId: c.buyerId ?? defaultBuyerId,
            }));
            const res = await deleteCategory({ value: entries });
            return jsonResult(res);
        }
        catch (err) {
            return formatToolError(err);
        }
    },
};
//# sourceMappingURL=delete-category.js.map