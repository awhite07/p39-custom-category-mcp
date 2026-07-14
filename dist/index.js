#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { config } from './config.js';
import { tools, toJsonSchema } from './tools/index.js';
const server = new Server({ name: 'peer39-mcp-server', version: '1.0.9' }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: tools.map((t) => ({
        name: t.name,
        description: t.description,
        inputSchema: toJsonSchema(t.inputSchema),
    })),
}));
server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const tool = tools.find((t) => t.name === req.params.name);
    if (!tool) {
        return {
            isError: true,
            content: [{ type: 'text', text: `Unknown tool: ${req.params.name}` }],
        };
    }
    const result = await tool.handler(req.params.arguments);
    return result;
});
const transport = new StdioServerTransport();
await server.connect(transport);
console.error(`[peer39-mcp] ready — baseUrl=${config.baseUrl}, tools=${tools.length}`);
//# sourceMappingURL=index.js.map