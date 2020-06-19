import {
    NewLineKind,
    ScriptKind,
    ScriptTarget,
    createPrinter,
    createSourceFile,
} from 'typescript';
import format from 'prettier-eslint';
import { accessSync, constants, existsSync, lstatSync, openSync, readdirSync, readFileSync, writeFileSync } from 'graceful-fs';
import { argv, exit } from 'process';
import { join } from 'path';

// The tag can't be a comment itself, as it'd be removed...
const NEWLINE_INNER_TAG = ' ### TEMP TAG FOR NEWLINE ### ';
const NEWLINE_TAG = 'console.log(\'' + NEWLINE_INNER_TAG + '\');';
const NEWLINE_SEARCH = 'console.log\\(\'' + NEWLINE_INNER_TAG + '\'\\);'

// TODO do it with only eslint, no more prettier
const options = {
    text: null as unknown as string,
    eslintConfig: {
        parserOptions: {
            ecmaVersion: 2020 // v11
        },
        rules: {}
    },
    prettierOptions: {
        singleQuote: true,
        quoteProps: 'preserve',
        trailingComma: 'none',
        arrowParens: 'avoid',
        parser: 'typescript'
    },
    fallbackPrettierOptions: {}
};

const srcPath = argv[2] && argv[2].trim() ? argv[2].trim() : '';
const destPath = argv[3] && argv[3].trim() ? argv[3].trim() : srcPath;
const pattern = argv[4]  && argv[4].trim() ? argv[4].trim() : null;
const replaceValue = argv[5]  && argv[5].trim() ? argv[5].trim() : '';

// if needed, will create a dest file path from the source file path
const transform = (path: string) => {
    if(!pattern && !replaceValue) {
        return path;
    }
    if(!pattern) { // replaceValue is a suffix
        return path + pattern;
    }
    const re = new RegExp(pattern);
    return path.replace(re, replaceValue);
}

function preserveNewlines (data: string) {
    return data.replace(/\n\n/g, '\n' + NEWLINE_TAG + '\n');
}

function restoreNewlines (data: string) {
    return data.replace(new RegExp(NEWLINE_SEARCH, 'g'), '');
}

function fileCleaner (srcFilePath: string, destFilePath: string) {
    accessSync(srcFilePath, constants.F_OK);

    const printerOptions = { newLine: NewLineKind.LineFeed, removeComments: true };
    const file = openSync(srcFilePath, 'r+', constants.O_RDWR);
    const originalCode = preserveNewlines(readFileSync(file, 'utf8'));
    const originalSrc = createSourceFile('dummyFileName.ts', originalCode, ScriptTarget.Latest, true, ScriptKind.TS);

    const purgedCode = createPrinter(printerOptions).printFile(originalSrc);

    const modifiedCode = restoreNewlines(purgedCode);

    options.text = modifiedCode;
    const prettyCode = format(options);

    writeFileSync(destFilePath, prettyCode);
    return 'Comments removed';
};

// TODO: if srcPath is a folder, walk recursively in the tree under it
function cleaner(srcPath: string, destPath: string, transform: (p: string) => string) {
    if (!srcPath) {
        throw new Error('a source must be provided');
    }
    if (!destPath) {
        console.log('Strip commments: no destination path provided, source path will be used');
    }
     
    const isSrcDir = existsSync(srcPath) && lstatSync(srcPath).isDirectory();
    const isDestDir = existsSync(destPath) && lstatSync(destPath).isDirectory(); 
    
    if (!isDestDir && isSrcDir && readdirSync(srcPath).length > 1) {
        throw new Error('destination is ambiguous, ie multi source files for only one destination file')
    }
    
    const srcPathList = isSrcDir ? readdirSync(srcPath): [srcPath];

    srcPathList.forEach(src => {
        const dest = isDestDir ? join(destPath, transform(src)): destPath;
        fileCleaner(join(srcPath, src), dest);
    });
    return 'Comments removed';
}

try {
    console.log(cleaner(srcPath, destPath, transform));
} catch (error) {
    console.log('Strip commments: ', error);
    exit(1);
}
