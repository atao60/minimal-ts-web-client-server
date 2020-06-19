import { IncomingMessage } from 'http';
import { parse as urlParse } from 'url';
import { parse as pathParse } from 'path';

export const WEB_ROOT_DIR = './public';
export const SRC_DIR = './src';

const RUNNING_FILE_EXT = '.js';

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

export const fetchContentType = (filePath: string) => {
  const extension = pathParse(filePath).ext.replace('.', '');
  const contentType = determineContentType(extension);
  return contentType;
};

const isModuleRequest = (request: IncomingMessage) => {
  const referer = request.headers.referer;
  const result = referer ? referer.endsWith(RUNNING_FILE_EXT) : false;
  return result;
};

export const fetchFilePathOnServer = (request: IncomingMessage) => {
  const requestUrl = request.url as string;
  const parsedUrl = urlParse(requestUrl);

  const suffix = (request => {
    if (isModuleRequest(request)) {
      return RUNNING_FILE_EXT;
    }
    if (parsedUrl.pathname === '/') {
      return 'index.html';
    }
    return '';
  })(request);
  return `${WEB_ROOT_DIR}${parsedUrl.pathname}${suffix}`;
};
