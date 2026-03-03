#!/usr/bin/env node

/**
 * Figma-Claude Bridge MCP Server
 *
 * This MCP server enables Claude AI to design in Figma by:
 * 1. Exposing Figma operations as MCP tools
 * 2. Communicating with Figma plugin via WebSocket
 * 3. Handling authentication and state management
 *
 * Supports multi-instance operation via primary/relay architecture:
 * - Primary mode: Owns port 3055, accepts Figma plugin + relay clients
 * - Relay mode: Connects as WS client to primary, forwards requests through it
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'node:net';
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

// Mode: 'primary' or 'relay'
let mode: 'primary' | 'relay' | 'starting' = 'starting';

// Primary-mode state
let relayClients = new Map<string, WebSocket>(); // relayId → ws
let relayRouting = new Map<string, string>(); // requestId → relayId
let relayIdCounter = 0;
let wss: WebSocketServer | null = null;

// Relay-mode state
let relayWs: WebSocket | null = null;
let relayReconnectTimer: ReturnType<typeof setTimeout> | null = null;
let relayReconnectDelay = 500; // ms, grows with backoff
const RELAY_MAX_RECONNECT_DELAY = 10000;

// ─── Primary Mode ────────────────────────────────────────────────────────────

function startPrimaryMode(): Promise<void> {
  return new Promise((resolve, reject) => {
    wss = new WebSocketServer({ port: WS_PORT });

    wss.on('listening', () => {
      mode = 'primary';
      console.error(`[primary] WebSocket server listening on port ${WS_PORT}`);
      console.error('[primary] Waiting for Figma plugin to connect...');
      resolve();
    });

    wss.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        // Port taken — clean up and let caller switch to relay
        wss?.close();
        wss = null;
        reject(error);
      } else {
        console.error('[primary] WebSocket server error:', error);
      }
    });

    wss.on('connection', (ws) => {
      // We don't know yet if this is a Figma plugin or a relay client.
      // Wait for the first message to decide.
      let identified = false;

      const identifyTimeout = setTimeout(() => {
        // Relay clients send mcp-relay-register within milliseconds of connecting.
        // If nothing arrived in 200ms, this is the Figma plugin.
        if (!identified) {
          identified = true;
          acceptAsFigmaPlugin(ws);
        }
      }, 200);

      ws.once('message', (data) => {
        if (identified) return; // Already classified by timeout

        try {
          const msg = JSON.parse(data.toString());
          if (msg.type === 'mcp-relay-register') {
            identified = true;
            clearTimeout(identifyTimeout);
            acceptAsRelayClient(ws);
          } else {
            // First message isn't relay registration — it's Figma plugin
            identified = true;
            clearTimeout(identifyTimeout);
            acceptAsFigmaPlugin(ws);
            // Process this first message since it's a real Figma message
            handleFigmaMessage(msg);
          }
        } catch {
          // Not valid JSON — treat as Figma plugin
          identified = true;
          clearTimeout(identifyTimeout);
          acceptAsFigmaPlugin(ws);
        }
      });

      ws.on('close', () => {
        clearTimeout(identifyTimeout);
      });
    });
  });
}

function acceptAsFigmaPlugin(ws: WebSocket) {
  console.error('[primary] Figma plugin connected!');

  if (figmaConnection && figmaConnection.readyState === WebSocket.OPEN) {
    console.error('[primary] Replacing previous Figma connection');
    figmaConnection.close();
  }
  figmaConnection = ws;

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      routeFigmaResponse(message);
    } catch (error) {
      console.error('[primary] Error parsing Figma message:', error);
    }
  });

  ws.on('close', () => {
    if (figmaConnection === ws) {
      console.error('[primary] Figma plugin disconnected');
      figmaConnection = null;

      // Reject all local pending requests
      for (const [, { reject }] of pendingRequests) {
        reject(new Error('Figma plugin disconnected'));
      }
      pendingRequests.clear();

      // Notify relay clients that have pending requests
      for (const [requestId, relayId] of relayRouting) {
        const client = relayClients.get(relayId);
        if (client && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'mcp-relay-response',
            requestId,
            error: { message: 'Figma plugin disconnected' },
          }));
        }
      }
      relayRouting.clear();
    }
  });

  ws.on('error', (error) => {
    console.error('[primary] Figma WebSocket error:', error);
  });
}

function acceptAsRelayClient(ws: WebSocket) {
  const relayId = `relay_${++relayIdCounter}`;
  relayClients.set(relayId, ws);
  console.error(`[primary] Relay client registered: ${relayId}`);

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.type === 'mcp-relay-request') {
        handleRelayRequest(relayId, msg);
      }
    } catch (error) {
      console.error(`[primary] Error parsing relay message from ${relayId}:`, error);
    }
  });

  ws.on('close', () => {
    console.error(`[primary] Relay client disconnected: ${relayId}`);
    relayClients.delete(relayId);

    // Clean up pending relay requests for this client
    for (const [requestId, rid] of relayRouting) {
      if (rid === relayId) {
        relayRouting.delete(requestId);
      }
    }
  });

  ws.on('error', (error) => {
    console.error(`[primary] Relay client error (${relayId}):`, error);
  });
}

function handleRelayRequest(relayId: string, msg: { requestId: string; command: string; data: any }) {
  if (!figmaConnection || figmaConnection.readyState !== WebSocket.OPEN) {
    const client = relayClients.get(relayId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'mcp-relay-response',
        requestId: msg.requestId,
        error: { message: 'Not connected to Figma plugin. Please open the plugin in Figma.' },
      }));
    }
    return;
  }

  // Track which relay client this request came from
  relayRouting.set(msg.requestId, relayId);

  // Forward to Figma
  figmaConnection.send(JSON.stringify({
    requestId: msg.requestId,
    type: msg.command,
    data: msg.data || {},
  }));

  // Timeout for relay requests
  setTimeout(() => {
    if (relayRouting.has(msg.requestId)) {
      relayRouting.delete(msg.requestId);
      const client = relayClients.get(relayId);
      if (client && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'mcp-relay-response',
          requestId: msg.requestId,
          error: { message: 'Request timeout' },
        }));
      }
    }
  }, 30000);
}

function routeFigmaResponse(message: any) {
  const { requestId } = message;

  if (requestId && relayRouting.has(requestId)) {
    // This response belongs to a relay client
    const relayId = relayRouting.get(requestId)!;
    relayRouting.delete(requestId);
    const client = relayClients.get(relayId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'mcp-relay-response',
        requestId,
        data: message.data,
        error: message.error,
      }));
    }
  } else {
    // Local request
    handleFigmaMessage(message);
  }
}

// Handle messages for local (this instance's) pending requests
function handleFigmaMessage(message: any) {
  const { requestId, data, error } = message;

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

// ─── Relay Mode ──────────────────────────────────────────────────────────────

function startRelayMode() {
  mode = 'relay';
  console.error(`[relay] Port ${WS_PORT} in use — connecting as relay client`);
  connectToRelay();
}

function connectToRelay() {
  if (relayWs) {
    relayWs.removeAllListeners();
    if (relayWs.readyState === WebSocket.OPEN || relayWs.readyState === WebSocket.CONNECTING) {
      relayWs.close();
    }
    relayWs = null;
  }

  relayWs = new WebSocket(`ws://localhost:${WS_PORT}`);

  relayWs.on('open', () => {
    console.error('[relay] Connected to primary');
    relayReconnectDelay = 500; // Reset backoff

    // Register as relay client
    relayWs!.send(JSON.stringify({ type: 'mcp-relay-register' }));
  });

  relayWs.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.type === 'mcp-relay-response') {
        handleRelayResponse(msg);
      }
    } catch (error) {
      console.error('[relay] Error parsing message from primary:', error);
    }
  });

  relayWs.on('close', () => {
    console.error('[relay] Disconnected from primary');
    relayWs = null;

    // Reject all pending requests
    for (const [, { reject }] of pendingRequests) {
      reject(new Error('Lost connection to primary MCP server'));
    }
    pendingRequests.clear();

    // Try to become primary (the previous primary might have shut down)
    attemptTakeover();
  });

  relayWs.on('error', (error: any) => {
    if (error.code !== 'ECONNREFUSED') {
      console.error('[relay] WebSocket error:', error.message);
    }
  });
}

function handleRelayResponse(msg: { requestId: string; data?: any; error?: any }) {
  const pending = pendingRequests.get(msg.requestId);
  if (pending) {
    pendingRequests.delete(msg.requestId);
    if (msg.error) {
      pending.reject(new Error(msg.error.message || 'Figma operation failed'));
    } else {
      pending.resolve(msg.data);
    }
  }
}

function attemptTakeover() {
  console.error('[relay] Attempting to become primary...');

  // Probe the port with a raw TCP connection first
  const probe = createServer();
  probe.once('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      // Port still taken — some other instance is primary, reconnect as relay
      console.error('[relay] Port still in use, reconnecting as relay...');
      scheduleRelayReconnect();
    }
  });
  probe.once('listening', () => {
    // Port is free — close probe and start as primary
    probe.close(() => {
      console.error('[relay → primary] Taking over as primary');
      mode = 'starting';
      startPrimaryMode()
        .then(() => {
          console.error('[primary] Takeover successful');
        })
        .catch(() => {
          // Someone else grabbed it first — go back to relay
          console.error('[relay] Takeover failed, reconnecting as relay...');
          mode = 'relay';
          scheduleRelayReconnect();
        });
    });
  });
  probe.listen(WS_PORT);
}

function scheduleRelayReconnect() {
  if (relayReconnectTimer) clearTimeout(relayReconnectTimer);
  relayReconnectTimer = setTimeout(() => {
    relayReconnectTimer = null;
    connectToRelay();
  }, relayReconnectDelay);
  relayReconnectDelay = Math.min(relayReconnectDelay * 2, RELAY_MAX_RECONNECT_DELAY);
}

// ─── sendToFigma (works in both modes) ───────────────────────────────────────

async function sendToFigma(type: string, data: any = {}): Promise<any> {
  if (mode === 'primary') {
    // Direct path — send to Figma plugin
    if (!figmaConnection || figmaConnection.readyState !== WebSocket.OPEN) {
      throw new Error('Not connected to Figma plugin. Please open the plugin in Figma.');
    }

    return new Promise((resolve, reject) => {
      const requestId = `req_${++requestIdCounter}`;
      pendingRequests.set(requestId, { resolve, reject });

      figmaConnection!.send(JSON.stringify({ requestId, type, data }));

      setTimeout(() => {
        if (pendingRequests.has(requestId)) {
          pendingRequests.delete(requestId);
          reject(new Error('Request timeout'));
        }
      }, 30000);
    });
  }

  if (mode === 'relay') {
    // Relay path — send through primary
    if (!relayWs || relayWs.readyState !== WebSocket.OPEN) {
      throw new Error('Not connected to primary MCP server. Reconnecting...');
    }

    return new Promise((resolve, reject) => {
      const requestId = `relay_req_${++requestIdCounter}`;
      pendingRequests.set(requestId, { resolve, reject });

      relayWs!.send(JSON.stringify({
        type: 'mcp-relay-request',
        requestId,
        command: type,
        data,
      }));

      setTimeout(() => {
        if (pendingRequests.has(requestId)) {
          pendingRequests.delete(requestId);
          reject(new Error('Request timeout'));
        }
      }, 30000);
    });
  }

  throw new Error('MCP server is starting up, please try again in a moment.');
}

// ─── MCP Server ──────────────────────────────────────────────────────────────

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

  const tool = figmaTools.find(t => t.name === name);
  if (!tool) {
    throw new Error(`Unknown tool: ${name}`);
  }

  try {
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

// ─── Startup ─────────────────────────────────────────────────────────────────

async function main() {
  // Try to start as primary; fall back to relay if port is taken
  try {
    await startPrimaryMode();
  } catch (err: any) {
    if (err.code === 'EADDRINUSE') {
      startRelayMode();
    } else {
      throw err;
    }
  }

  // Start MCP server regardless of mode
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`MCP server running in ${mode} mode`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
