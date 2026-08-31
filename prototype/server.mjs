import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const port = Number(process.env.PORT || 4173);
const root = new URL('.', import.meta.url).pathname;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

createServer(async (request, response) => {
  try {
    const urlPath = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
    const safePath = normalize(urlPath).replace(/^(\.\.(\/|\\|$))+/, '');
    let filePath = join(root, safePath === '/' ? 'index.html' : safePath);
    const info = await stat(filePath);
    if (info.isDirectory()) filePath = join(filePath, 'index.html');
    const body = await readFile(filePath);
    response.writeHead(200, { 'content-type': types[extname(filePath)] || 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('页面不存在');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Bobby prototype: http://127.0.0.1:${port}`);
});

