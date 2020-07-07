import { createServer, IncomingMessage, Server, ServerResponse } from 'http';
import { copyFileSync, readFile } from 'graceful-fs';

import { getWatcher } from './watcher';
import { startTypescriptCompiler } from './watchingCompiler';
import { getSocketServer, sendToSocketClients } from './socketServer';
import {
  fetchContentType,
  fetchFilePathOnServer,
  SRC_DIR,
  WEB_ROOT_DIR
} from './serverHelpers';
import { setupCleanupActions } from './processHelpers';
import { join, relative } from 'path';

const APP_PORT = 3000;

const SOCKET_PORT = 3333;

const requestHandler = (request: IncomingMessage, response: ServerResponse) => {
  console.log(`Request: ${request.method} ${request.url}`);

  if (request.url === '/favicon.ico') {
    response.statusCode = 404;
    response.end();
    return;
  }

  const filePath = fetchFilePathOnServer(request);

  readFile(filePath, (error, fileData) => {
    if (error) {
      console.error(error);
      response.statusCode = 500;
      response.end('There was an error getting the request file.');
    } else {
      const contentType = fetchContentType(filePath);
      response.setHeader('Content-Type', contentType);
      response.end(fileData);
    }
  });
};

const server: Server = createServer(requestHandler);
const typescriptCompiler = startTypescriptCompiler();
const socketServer = getSocketServer(SOCKET_PORT);

const srcFileWatcher = getWatcher(SRC_DIR, { ignored: /\.ts\s*$/ });
const handleSrcFileChange = (path: string, event: string) => {
  if (!path) {
    return;
  }
  const dest = join(WEB_ROOT_DIR, relative(SRC_DIR, path));
  const src = path;
  copyFileSync(src, dest);
};
srcFileWatcher.on('change', handleSrcFileChange);

const webFileWatcher = getWatcher(WEB_ROOT_DIR);
const handleWebFileChange = (path: string, event: string) => {
  if (!path) {
    return;
  }
  const data: {} = {
    event,
    path,
    shouldReload: true
  };

  sendToSocketClients(socketServer, data);
};
webFileWatcher.on('change', handleWebFileChange);

setupCleanupActions([
  () => {
    console.error('Runtime TS compiler shutting down.');
    typescriptCompiler.kill();
  },
  () => {
    console.error('Socket server shutting down.');
    socketServer.clients.forEach(client => client.terminate());
    socketServer.close();
  },
  () => {
    console.error('Web server shutting down.');
    server.close();
  }
]);

server.listen(APP_PORT, () => {
  console.log(`Web server listening on port ${APP_PORT}`);
});
