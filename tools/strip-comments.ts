import {
    NewLineKind,
    ScriptKind,
    ScriptTarget,
    createPrinter,
    createSourceFile,
} from 'typescript';
import format from 'prettier-eslint';
import { accessSync, constants, openSync, readFileSync, writeFileSync } from 'fs';
import { argv, exit } from 'process';

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

const srcFilePath = argv[2] && argv[2].trim() ? argv[2].trim() : '';
const destFilePath = argv[3] && argv[3].trim() ? argv[3].trim() : srcFilePath + '.purged';

if (!srcFilePath) {
    console.log('Strip commments: a file path must be provided');
    exit(1);
}

console.log('Strip commments from: ', srcFilePath)

function preserveNewlines (data: string) {
    return data.replace(/\n\n/g, '\n' + NEWLINE_TAG + '\n');
}

function restoreNewlines (data: string) {
    return data.replace(new RegExp(NEWLINE_SEARCH, 'g'), '');
}

export function cleaner (srcFilePath: string, destFilePath: string) {
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

try {
    console.log(cleaner(srcFilePath, destFilePath));
} catch (error) {
    console.log('Unable to remove comments :', error);
    exit(1);
}
