import { zodToJsonSchema } from 'zod-to-json-schema';
import { configureTool } from './configure.js';
import { checkSetupTool } from './check-setup.js';
import { getCategoryTool } from './get-category.js';
import { listCategoriesTool } from './list-categories.js';
import { createCategoryTool } from './create-category.js';
import { updateCategoryDetailsTool } from './update-category-details.js';
import { updateCategoryItemsTool } from './update-category-items.js';
import { updateCategoryTool } from './update-category.js';
import { deleteCategoryTool } from './delete-category.js';
import { getUrlExamplesTool } from './get-url-examples.js';
export const tools = [
    configureTool,
    checkSetupTool,
    getCategoryTool,
    listCategoriesTool,
    createCategoryTool,
    updateCategoryDetailsTool,
    updateCategoryItemsTool,
    updateCategoryTool,
    deleteCategoryTool,
    getUrlExamplesTool,
];
export function toJsonSchema(schema) {
    return zodToJsonSchema(schema, { target: 'jsonSchema7' });
}
// Shared helpers for tool handlers.
import { MissingConfigError, Peer39ApiError } from '../api/errors.js';
export function errorResult(text) {
    return { isError: true, content: [{ type: 'text', text }] };
}
export function jsonResult(value) {
    return { content: [{ type: 'text', text: JSON.stringify(value, null, 2) }] };
}
export function textResult(text) {
    return { content: [{ type: 'text', text }] };
}
export function formatToolError(err) {
    if (err instanceof MissingConfigError)
        return errorResult(err.message);
    if (err instanceof Peer39ApiError)
        return errorResult(`Peer39 error ${err.code}: ${err.message}`);
    if (err instanceof Error)
        return errorResult(`Unexpected error: ${err.message}`);
    return errorResult(`Unexpected error: ${String(err)}`);
}
//# sourceMappingURL=index.js.map