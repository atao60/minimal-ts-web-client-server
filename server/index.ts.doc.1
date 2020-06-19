// =============================================================================
// ====== DOC VERSION ONLY =====================================================
//    The server does not actually run this file.
//    If you change things in here, nothing else changes; the server won't run differently

/*
  These are Node system modules -- they are statically imported because if they
  aren't present at all, we want to fail very loudly right off the bat instead
  of failing later on when we actually need to use them.
*/
import { createServer, IncomingMessage, Server, ServerResponse } from 'http';
import { readFile } from 'fs';
import { parse as pathParse } from 'path';
import { parse as urlParse } from 'url';

/**
 * This is the port we want the server to run on: it's the number that you see
 * in a url like `localhost:3000`.
 *
 * @constant {number} PORT
 */
const PORT = 3000;
/**
 * This is how we determine whether or not a module is being requested. This doesn't need to be a full path -- just something unique to identify a request by. If the folder your compiled script end up in is `src`, then the referer will contain `/src/`. (Those slashes are slashes as in a folder path, _not_ as in a regular expression delimiter.)
 *
 * @constant {string} SRC_BUILD_FOLDER_PATTERN
 */
const SRC_BUILD_FOLDER_PATTERN = '/src/';
/**
 * This is the 'root' of the server; it is what all other paths are relative to.
 *
 * @constant {string} SERVER_ROOT_FOLDER
 */
const SERVER_ROOT_FOLDER = './public';

/**
 * Used to determine the correct content-type to serve the response with.
 *
 * @function determineContentType
 *
 * @param {string} extension the extension of the file that was originally requested
 * @returns {string} the desired file type
 */
const determineContentType = (extension: string) => {
  const map: { [key: string]: string } = {
    css: 'text/css',
    js: 'text/javascript',
    html: 'text/html',
    plain: 'text/plain'
  } as const;

  const index = (extension in map) ? extension : 'plain';
  return map[index];
};

/**
 * Used for determining whether we should serve a Javascript file in response.
 *
 * Because of the fact that module names don't have the extension included in
 * Typescript, we can use the fact that `type="module"` on an HTML `script` element
 * means the browser will make a specific kind of HTTP request.
 *
 * When the browser requests a module, it includes the file that made the
 * request -- if your `index.js` file has an import like
 * `import { aModule } ...`, the server will receive a request from the browser
 * with a `referer` header of something like `index.js`. Other requests don't
 * ordinarily include this header, which is why we can use it here to figure
 * out whether a module has been requested.
 *
 * (FYI: `referer` _really_ is the correct spelling, here.)
 *
 * @function isModuleRequest
 *
 * @param {Http.IncomingMessage} request the original request from the browser
 *
 * @returns {boolean} whether the file being requested is a JS module
 */
const isModuleRequest = (request: IncomingMessage) => {
  // `referer` is the header that represents who made the request
  /** @type {string} */
  const referer = request.headers.referer;

  const result = referer ? referer.includes(SRC_BUILD_FOLDER_PATTERN) : false;
  return result;
};

/**
 * Used to figure out the actual path -- on the _server_ (aka, your computer!) --
 * to the file we want to send as a response.
 *
 * If you change your `SERVER_ROOT_FOLDER` (defined above), that will change
 * what happens in here. (Remember to make sure your `tsconfig.json` matches!)
 *
 * @function getPath
 *
 * @param {Http.IncomingMessage} request
 *
 * @returns {string} the path to find our file at
 */
const getPath = (request: IncomingMessage) => {
  
  const requestUrl = request.url as string;
  const parsedUrl = urlParse(requestUrl);

  const suffix = ((request) => {
    if (isModuleRequest(request)) {
      return '.js';
    }
    if (parsedUrl.pathname === '/') {
      // This ensures that navigating to "localhost:PORT" just loads the homepage
      return 'index.html';
    }
    return '';
  })(request);
  return `${SERVER_ROOT_FOLDER}${parsedUrl.pathname}${suffix}`;
};

/**
 * Used to actually process and respond to any requests the server receives. This
 * does most of the work: it gets the requests from the browser, checks some
 * things on them, etc.
 *
 * @function requestHandler
 *
 * @param {Http.IncomingMessage} request
 * @param {Http.ServerResponse} response
 */
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
      response.statusCode = 500; // internal server error
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

// ==== friendly reminder that this is the doc file! ===========================
