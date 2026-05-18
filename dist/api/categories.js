import { request } from './client.js';
export async function getCategory(accountCategoryId, partnerId, buyerId) {
    return request({
        method: 'GET',
        path: `/api/external/customcategories/${accountCategoryId}`,
        query: { partner: partnerId, buyer: buyerId },
    });
}
export async function listCategories(query) {
    return request({
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
export async function createCategory(req, ctx) {
    return request({
        method: 'POST',
        path: '/api/external/customcategories',
        body: req,
        extraHeaders: { system: ctx.system },
    });
}
export async function updateBasicDetails(req) {
    return request({
        method: 'PUT',
        path: '/api/external/customcategories/updateBasicDetails',
        body: req,
    });
}
export async function updateItems(req) {
    return request({
        method: 'POST',
        path: '/api/external/customcategories/items',
        body: req,
    });
}
export async function updateCategory(req) {
    return request({
        method: 'PUT',
        path: '/api/external/customcategories',
        body: req,
    });
}
export async function deleteCategory(req) {
    return request({
        method: 'PUT',
        path: '/api/external/customcategories/delete',
        body: req,
    });
}
export async function getUrlExamples(req) {
    return request({
        method: 'POST',
        path: '/api/external/prediction/urlexamples',
        body: req,
        expectErrorCode: false,
    });
}
//# sourceMappingURL=categories.js.map