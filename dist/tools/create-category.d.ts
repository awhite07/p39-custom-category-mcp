import type { CategoryResponse, CategoryType, ItemsType } from '../api/types.js';
import type { ToolDefinition } from './index.js';
export declare function formatCreatedSummary(opts: {
    res: CategoryResponse;
    categoryName: string;
    type: CategoryType;
    items: string[];
    itemsTypes?: ItemsType[];
    partnerId: number;
    buyerId: number;
    expirationDate?: string;
}): string;
export declare const createCategoryTool: ToolDefinition;
//# sourceMappingURL=create-category.d.ts.map