import type { CategoryResponse, CreateCategoryRequest, DeleteCategoryRequest, DeleteCategoryResponse, ListCategoriesQuery, ListCategoriesResponse, UpdateAllCategoryRequest, UpdateBasicDetailsRequest, UpdateItemsRequest, UrlExamplesRequest, UrlExamplesResponse } from './types.js';
export declare function getCategory(accountCategoryId: number, partnerId: number, buyerId: number): Promise<CategoryResponse>;
export declare function listCategories(query: ListCategoriesQuery): Promise<ListCategoriesResponse>;
export declare function createCategory(req: CreateCategoryRequest, ctx: {
    system: string;
}): Promise<CategoryResponse>;
export declare function updateBasicDetails(req: UpdateBasicDetailsRequest): Promise<CategoryResponse>;
export declare function updateItems(req: UpdateItemsRequest): Promise<CategoryResponse>;
export declare function updateCategory(req: UpdateAllCategoryRequest): Promise<CategoryResponse>;
export declare function deleteCategory(req: DeleteCategoryRequest): Promise<DeleteCategoryResponse>;
export declare function getUrlExamples(req: UrlExamplesRequest): Promise<UrlExamplesResponse>;
//# sourceMappingURL=categories.d.ts.map