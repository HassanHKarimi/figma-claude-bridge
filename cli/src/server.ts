/**
 * Figma Bridge Server
 *
 * Accepts the Figma plugin on WebSocket port 3055
 * and CLI commands on HTTP port 3056.
 *
 * CLI commands arrive as HTTP POST with JSON body:
 *   { "command": "create-frame", "args": { "name": "Header" } }
 *
 * The server forwards each command to the plugin, waits for the response,
 * and returns it as the HTTP response.
 */

import { WebSocketServer, WebSocket } from 'ws';
import { createServer, IncomingMessage, ServerResponse } from 'node:http';

const WS_PORT = process.env.FIGMA_WS_PORT ? parseInt(process.env.FIGMA_WS_PORT, 10) : 3055;
const HTTP_PORT = process.env.FIGMA_HTTP_PORT ? parseInt(process.env.FIGMA_HTTP_PORT, 10) : 3057;
const REQUEST_TIMEOUT = 30_000;

let pluginConnection: WebSocket | null = null;
let pendingRequests = new Map<string, { resolve: (data: any) => void; reject: (err: Error) => void }>();
let requestIdCounter = 0;

// ─── WebSocket Server (Plugin) ───────────────────────────────────────────────

function startWebSocketServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    const wss = new WebSocketServer({ port: WS_PORT });

    wss.on('listening', () => {
      console.error(`[server] WebSocket listening on port ${WS_PORT} (plugin)`);
      resolve();
    });

    wss.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`[server] Port ${WS_PORT} already in use. Is another server running?`);
        reject(err);
      } else {
        console.error('[server] WebSocket error:', err);
      }
    });

    wss.on('connection', (ws) => {
      console.error('[server] Figma plugin connected');

      if (pluginConnection && pluginConnection.readyState === WebSocket.OPEN) {
        console.error('[server] Replacing previous plugin connection');
        pluginConnection.close();
      }
      pluginConnection = ws;

      ws.on('message', (data) => {
        try {
          const msg = JSON.parse(data.toString());
          handlePluginResponse(msg);
        } catch (err) {
          console.error('[server] Bad message from plugin:', err);
        }
      });

      ws.on('close', () => {
        if (pluginConnection === ws) {
          console.error('[server] Figma plugin disconnected');
          pluginConnection = null;
          rejectAllPending('Figma plugin disconnected');
        }
      });

      ws.on('error', (err) => {
        console.error('[server] Plugin WebSocket error:', err);
      });
    });
  });
}

function handlePluginResponse(msg: { requestId?: string; data?: any; error?: any }) {
  if (!msg.requestId) return;
  const pending = pendingRequests.get(msg.requestId);
  if (!pending) return;
  pendingRequests.delete(msg.requestId);

  if (msg.error) {
    pending.reject(new Error(msg.error.message || 'Figma operation failed'));
  } else {
    pending.resolve(msg.data);
  }
}

function rejectAllPending(reason: string) {
  for (const [, { reject }] of pendingRequests) {
    reject(new Error(reason));
  }
  pendingRequests.clear();
}

function sendToPlugin(command: string, args: Record<string, any> = {}): Promise<any> {
  if (!pluginConnection || pluginConnection.readyState !== WebSocket.OPEN) {
    return Promise.reject(new Error('Not connected to Figma plugin. Open the plugin in Figma first.'));
  }

  return new Promise((resolve, reject) => {
    const requestId = `req_${++requestIdCounter}`;
    pendingRequests.set(requestId, { resolve, reject });

    pluginConnection!.send(JSON.stringify({ requestId, type: command, data: args }));

    setTimeout(() => {
      if (pendingRequests.has(requestId)) {
        pendingRequests.delete(requestId);
        reject(new Error(`Request timeout after ${REQUEST_TIMEOUT / 1000}s`));
      }
    }, REQUEST_TIMEOUT);
  });
}

// ─── HTTP Server (CLI) ──────────────────────────────────────────────────────

function startHttpServer(): Promise<void> {
  return new Promise((resolve) => {
    const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      // CORS headers for potential future use
      res.setHeader('Content-Type', 'application/json');

      // GET /status — connection health check
      if (req.method === 'GET' && req.url === '/status') {
        res.writeHead(200);
        res.end(JSON.stringify({
          server: 'running',
          plugin: pluginConnection?.readyState === WebSocket.OPEN ? 'connected' : 'disconnected',
          pendingRequests: pendingRequests.size,
        }));
        return;
      }

      // POST / — execute a command
      if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', async () => {
          try {
            const { command, args } = JSON.parse(body);
            if (!command) {
              res.writeHead(400);
              res.end(JSON.stringify({ error: 'Missing "command" field' }));
              return;
            }

            const data = await sendToPlugin(command, args || {});
            res.writeHead(200);
            res.end(JSON.stringify({ success: true, data }));
          } catch (err: any) {
            res.writeHead(err.message.includes('Not connected') ? 503 : 500);
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
        return;
      }

      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not found' }));
    });

    httpServer.listen(HTTP_PORT, () => {
      console.error(`[server] HTTP API listening on port ${HTTP_PORT} (CLI)`);
      resolve();
    });
  });
}

// ─── Main ───────────────────────────────────────────────────────────────────

export async function serve() {
  console.error('figma-bridge server starting...');
  await startWebSocketServer();
  await startHttpServer();
  console.error(`\nReady.`);
  console.error(`  Plugin WebSocket: ws://localhost:${WS_PORT}`);
  console.error(`  CLI HTTP API:     http://localhost:${HTTP_PORT}\n`);
  console.error('Waiting for Figma plugin to connect...');
}
