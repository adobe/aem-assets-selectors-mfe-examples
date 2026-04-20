import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const PORT = 8080;
const ROOT = new URL('.', import.meta.url).pathname;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'text/javascript',
  '.mjs':  'text/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

function loadEnv() {
  const envPath = join(ROOT, '.env');
  if (!existsSync(envPath)) {
    console.error('\n  ERROR: .env file not found.');
    console.error('  Copy .env.example to .env and add your IMS Client ID:\n');
    console.error('    cp .env.example .env\n');
    process.exit(1);
  }
  const env = {};
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    env[key.trim()] = rest.join('=').trim();
  }
  return env;
}

const env = loadEnv();
const imsClientId = env.ASSET_SELECTOR_IMS_CLIENT_ID;
const imsOrg = env.ASSET_SELECTOR_IMS_ORG || null;

if (!imsClientId || imsClientId === '<YOUR_IMS_CLIENT_ID>') {
  console.error('\n  ERROR: ASSET_SELECTOR_IMS_CLIENT_ID is not set in .env\n');
  process.exit(1);
}

const server = createServer((req, res) => {
  let urlPath = new URL(req.url, `http://localhost:${PORT}`).pathname;
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = join(ROOT, urlPath);

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
    return;
  }

  const ext = extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  let body = readFileSync(filePath);

  if (ext === '.html' || ext === '.js') {
    body = body.toString('utf-8')
      .replace(/%%ASSET_SELECTOR_IMS_CLIENT_ID%%/g, imsClientId)
      .replace(
        /(['"])%%ASSET_SELECTOR_IMS_ORG%%\1/g,
        imsOrg ? `"${imsOrg}"` : 'null'
      );
  }

  res.writeHead(200, { 'Content-Type': contentType });
  res.end(body);
});

server.listen(PORT, 'localhost', () => {
  console.log(`\n  Vanilla JS example running at:\n`);
  console.log(`    http://localhost:${PORT}/`);
  console.log(`    http://localhost:${PORT}/integration.html`);
  console.log(`    http://localhost:${PORT}/dnd.html\n`);
  console.log(`  Using IMS Client ID: ${imsClientId.slice(0, 8)}...`);
  console.log(`  Using IMS Org:       ${imsOrg || '(none -- repo selector will show)'}\n`);
});
