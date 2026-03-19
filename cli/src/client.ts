/**
 * Figma Bridge CLI Client
 *
 * Sends a single command to the figma-bridge server via HTTP,
 * prints the JSON response to stdout, and exits.
 */

import http from 'node:http';

const HTTP_PORT = process.env.FIGMA_HTTP_PORT ? parseInt(process.env.FIGMA_HTTP_PORT, 10) : 3057;
const BASE_URL = `http://localhost:${HTTP_PORT}`;

function httpRequest(method: string, path: string, body?: string): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const req = http.request(url, { method, headers: body ? { 'Content-Type': 'application/json' } : {} }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode || 0, body: data }));
    });
    req.on('error', (err: any) => {
      if (err.code === 'ECONNREFUSED') {
        reject(new Error('Cannot connect to figma-bridge server. Run "figma-bridge serve" first.'));
      } else {
        reject(err);
      }
    });
    if (body) req.write(body);
    req.end();
  });
}

function parseJson(body: string): any {
  try {
    return JSON.parse(body);
  } catch {
    throw new Error(`Unexpected response from server: ${body.slice(0, 200)}`);
  }
}

export async function status(): Promise<void> {
  const res = await httpRequest('GET', '/status');
  const data = parseJson(res.body);
  console.log(JSON.stringify(data, null, 2));
}

export async function runCommand(command: string, args: Record<string, any>): Promise<void> {
  const res = await httpRequest('POST', '/', JSON.stringify({ command, args }));
  const data = parseJson(res.body);

  if (data.success) {
    console.log(JSON.stringify(data.data, null, 2));
  } else {
    console.error(JSON.stringify({ error: data.error }, null, 2));
    process.exit(1);
  }
}
