import { request } from './client.js';
import type {
  CategoryResponse,
  CreateCategoryRequest,
  DeleteCategoryRequest,
  DeleteCategoryResponse,
  ListCategoriesQuery,
  ListCategoriesResponse,
  UpdateAllCategoryRequest,
  UpdateBasicDetailsRequest,
  UpdateItemsRequest,
  UrlExamplesRequest,
  UrlExamplesResponse,
} from './types.js';

export async function getCategory(
  accountCategoryId: number,
  partnerId: number,
  buyerId: number,
): Promise<CategoryResponse> {
  return request<CategoryResponse>({
    method: 'GET',
    path: `/api/external/customcategories/${accountCategoryId}`,
    query: { partner: partnerId, buyer: buyerId },
  });
}

export async function listCategories(query: ListCategoriesQuery): Promise<ListCategoriesResponse> {
  return request<ListCategoriesResponse>({
    method: 'GET',
    path: '/api/external/customcategories',
    query: {
      buyer: query.buyer,
      partner: query.partner,
      max: query.max,
      start: query.start,
      sort: query.sort,
      filterProperty: query.filterProperty,
      filterValue: query.filterValue,
      filterRange: query.filterRange,
    },
  });
}

export async function createCategory(
  req: CreateCategoryRequest,
  ctx: { system: string },
): Promise<CategoryResponse> {
  return request<CategoryResponse>({
    method: 'POST',
    path: '/api/external/customcategories',
    body: req,
    extraHeaders: { system: ctx.system },
  });
}

export async function updateBasicDetails(req: UpdateBasicDetailsRequest): Promise<CategoryResponse> {
  return request<CategoryResponse>({
    method: 'PUT',
    path: '/api/external/customcategories/updateBasicDetails',
    body: req,
  });
}

export async function updateItems(req: UpdateItemsRequest): Promise<CategoryResponse> {
  return request<CategoryResponse>({
    method: 'POST',
    path: '/api/external/customcategories/items',
    body: req,
  });
}

export async function updateCategory(req: UpdateAllCategoryRequest): Promise<CategoryResponse> {
  return request<CategoryResponse>({
    method: 'PUT',
    path: '/api/external/customcategories',
    body: req,
  });
}

export async function deleteCategory(req: DeleteCategoryRequest): Promise<DeleteCategoryResponse> {
  return request<DeleteCategoryResponse>({
    method: 'PUT',
    path: '/api/external/customcategories/delete',
    body: req,
  });
}

export async function getUrlExamples(req: UrlExamplesRequest): Promise<UrlExamplesResponse> {
  return request<UrlExamplesResponse>({
    method: 'POST',
    path: '/api/external/prediction/urlexamples',
    body: req,
    expectErrorCode: false,
  });
}
