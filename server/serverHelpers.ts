import { IncomingMessage } from 'http';
import { parse as urlParse } from 'url';
import { join, parse as pathParse } from 'path';
import { existsSync } from 'fs';

export const WEB_ROOT_DIR = './public';
export const SRC_DIR = './src';

const NODE_MODULES_DIR = './node_modules';
const RUNNING_FILE_EXT = '.js';

const defaultContentType = 'text/plain';
const contentTypeMap: { [key: string]: string; } = {
    css: 'text/css',
    js: 'text/javascript',
    html: 'text/html',
    plain: defaultContentType
} as const;

const determineContentType = (extension: string, contentTypeByDefault = defaultContentType) => {
    return contentTypeMap[extension] || contentTypeByDefault;
};

// to be used only with full path, ie the file extension is known if any.
export const fetchContentType = (filePath: string, contentTypeByDefault?: string) => {
    const extension = pathParse(filePath).ext.replace('.', '');
    const contentType = determineContentType(extension, contentTypeByDefault);
    return contentType;
};

export const fetchFilePathOnServer = (request: IncomingMessage): string => {
    const requestUrl = request.url || '';
    const parsedUrl = urlParse(requestUrl);
    const pathname = parsedUrl.pathname || '';

    const pathParts: string[] = [];
    if (!/^\.{0,2}\//.exec(pathname)) { // bare module resolving
        // add relative path of node_modules
        // and if no file ext., add '.js' as such
        pathParts.push(NODE_MODULES_DIR);
        const hasNoFileExt = !fetchContentType(pathname, '');
        const extension = hasNoFileExt ? RUNNING_FILE_EXT : '';
        const longpath = pathname + extension;
        pathParts.push(longpath);
    }
    else if (pathname === '/') {
        pathParts.push(WEB_ROOT_DIR)
        pathParts.push('index.html');
    }
    else if (/^\.{0,2}\/node_modules/.exec(pathname)) { // explicit node module
        pathParts.push(pathname);
    }
    else  { // inner project module
        // always relative to WEB_ROOT_DIR
        // first search as it then if no file ext, with ext. '.js'
        // filePathOnServerParts.push(WEB_ROOT_DIR)
        const shortpath = join(WEB_ROOT_DIR, pathname);
        const extension = existsSync(shortpath) ? '' : RUNNING_FILE_EXT;
        const longpath = shortpath + extension;
        pathParts.push(longpath);
    }
    return join('.', ...pathParts);
}