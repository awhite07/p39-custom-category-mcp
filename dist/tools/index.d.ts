import type { ZodTypeAny } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
export interface ToolResult {
    content: Array<{
        type: 'text';
        text: string;
    }>;
    isError?: boolean;
}
export interface ToolDefinition {
    name: string;
    description: string;
    inputSchema: ZodTypeAny;
    handler: (args: unknown) => Promise<ToolResult>;
}
export declare const tools: ToolDefinition[];
export declare function toJsonSchema(schema: ZodTypeAny): ReturnType<typeof zodToJsonSchema>;
export declare function errorResult(text: string): ToolResult;
export declare function jsonResult(value: unknown): ToolResult;
export declare function formatToolError(err: unknown): ToolResult;
//# sourceMappingURL=index.d.ts.map