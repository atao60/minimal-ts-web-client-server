import { createServer, IncomingMessage, Server, ServerResponse } from 'http';
import { readFile } from 'fs';
import { parse as pathParse } from 'path';
import { parse as urlParse } from 'url';

const PORT = 3000;
const SRC_BUILD_FOLDER_PATTERN = '/src/';
const SERVER_ROOT_FOLDER = './public';

const determineContentType = (extension: string) => {
  const map: {
    [key: string]: string;
  } = {
    css: 'text/css',
    js: 'text/javascript',
    html: 'text/html',
    plain: 'text/plain'
  } as const;

  const index = extension in map ? extension : 'plain';
  return map[index];
};

const isModuleRequest = (request: IncomingMessage) => {
  const referer = request.headers.referer;

  const result = referer ? referer.includes(SRC_BUILD_FOLDER_PATTERN) : false;
  return result;
};

const getPath = (request: IncomingMessage) => {
  const requestUrl = request.url as string;
  const parsedUrl = urlParse(requestUrl);

  const suffix = (request => {
    if (isModuleRequest(request)) {
      return '.js';
    }
    if (parsedUrl.pathname === '/') {
      return 'index.html';
    }
    return '';
  })(request);
  return `${SERVER_ROOT_FOLDER}${parsedUrl.pathname}${suffix}`;
};

const requestHandler = (request: IncomingMessage, response: ServerResponse) => {
  console.log(`${request.method} ${request.url}`);

  if (request.url === '/favicon.ico') {
    response.statusCode = 404;
    response.end();
    return;
  }

  const filePath = getPath(request);
  const extension = pathParse(filePath).ext.replace('.', '');
  const contentType = determineContentType(extension);

  readFile(filePath, (error, fileData) => {
    if (error) {
      console.error(error);
      response.statusCode = 500;
      response.end('There was an error getting the request file.');
    } else {
      response.setHeader('Content-Type', contentType);
      response.end(fileData);
    }
  });
};

const server: Server = createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
