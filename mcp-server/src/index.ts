#!/usr/bin/env node

/**
 * Figma-Claude Bridge MCP Server
 * 
 * This MCP server enables Claude AI to design in Figma by:
 * 1. Exposing Figma operations as MCP tools
 * 2. Communicating with Figma plugin via WebSocket
 * 3. Handling authentication and state management
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { WebSocketServer, WebSocket } from 'ws';
import { createRequire } from 'node:module';
import { figmaTools } from './tools/index.js';

// Convert Zod schema to JSON Schema, avoiding deep type instantiation
const _require = createRequire(import.meta.url);
const { zodToJsonSchema } = _require('zod-to-json-schema');
function toJsonSchema(zodSchema: any): any {
  const schema = zodToJsonSchema(zodSchema);
  // Remove $schema field - some MCP clients don't expect it
  delete schema.$schema;
  return schema;
}

// Server configuration
const WS_PORT = process.env.FIGMA_WS_PORT ? parseInt(process.env.FIGMA_WS_PORT, 10) : 3055;
const MCP_SERVER_NAME = 'figma-claude-bridge';
const MCP_SERVER_VERSION = '1.0.0';

// State management
let figmaConnection: WebSocket | null = null;
let pendingRequests = new Map<string, { resolve: Function; reject: Function }>();
let requestIdCounter = 0;

// Initialize WebSocket server for Figma plugin connection
const wss = new WebSocketServer({ port: WS_PORT });

wss.on('listening', () => {
  console.error(`WebSocket server listening on port ${WS_PORT}`);
  console.error('Waiting for Figma plugin to connect...');
});

wss.on('error', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${WS_PORT} is already in use. Another instance may be running.`);
  } else {
    console.error('WebSocket server error:', error);
  }
});

wss.on('connection', (ws) => {
  console.error('Figma plugin connected!');

  // Close previous connection if exists
  if (figmaConnection && figmaConnection.readyState === WebSocket.OPEN) {
    console.error('Replacing previous connection');
    figmaConnection.close();
  }
  figmaConnection = ws;

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      handleFigmaMessage(message);
    } catch (error) {
      console.error('Error parsing Figma message:', error);
    }
  });

  ws.on('close', () => {
    // Only clear if this is still the active connection
    if (figmaConnection === ws) {
      console.error('Figma plugin disconnected');
      figmaConnection = null;

      // Reject all pending requests
      for (const [id, { reject }] of pendingRequests) {
        reject(new Error('Figma plugin disconnected'));
      }
      pendingRequests.clear();
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Handle messages from Figma plugin
function handleFigmaMessage(message: any) {
  const { requestId, type, data, error } = message;

  if (requestId && pendingRequests.has(requestId)) {
    const { resolve, reject } = pendingRequests.get(requestId)!;
    pendingRequests.delete(requestId);

    if (error) {
      reject(new Error(error.message || 'Figma operation failed'));
    } else {
      resolve(data);
    }
  }
}

// Send request to Figma plugin and wait for response
async function sendToFigma(type: string, data: any = {}): Promise<any> {
  if (!figmaConnection || figmaConnection.readyState !== WebSocket.OPEN) {
    throw new Error('Not connected to Figma plugin. Please open the plugin in Figma.');
  }

  return new Promise((resolve, reject) => {
    const requestId = `req_${++requestIdCounter}`;
    pendingRequests.set(requestId, { resolve, reject });

    figmaConnection!.send(JSON.stringify({
      requestId,
      type,
      data
    }));

    // Timeout after 30 seconds
    setTimeout(() => {
      if (pendingRequests.has(requestId)) {
        pendingRequests.delete(requestId);
        reject(new Error('Request timeout'));
      }
    }, 30000);
  });
}

// Initialize MCP server
const server = new Server(
  {
    name: MCP_SERVER_NAME,
    version: MCP_SERVER_VERSION,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: figmaTools.map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: toJsonSchema(tool.inputSchema),
    })),
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  // Find the tool
  const tool = figmaTools.find(t => t.name === name);
  if (!tool) {
    throw new Error(`Unknown tool: ${name}`);
  }

  try {
    // Execute the tool by sending command to Figma
    const result = await tool.execute(args, sendToFigma);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the MCP server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP server running');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
