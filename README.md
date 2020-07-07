Welcome to minimal-ts-web-client-server 👋
===
[![Github Version](https://img.shields.io/github/package-json/v/atao60/minimal-ts-web-client-server?label=github&color=#0366d6)](https://github.com/atao60/minimal-ts-web-client-server)
[![Github Version](https://img.shields.io/github/issues/atao60/minimal-ts-web-client-server)](https://github.com/atao60/minimal-ts-web-client-server/issue)
[![License: MIT](https://img.shields.io/github/license/atao60/minimal-ts-web-client-server)](https://github.com/atao60/minimal-ts-web-client-server/blob/master/LICENSE)

<span style="font-size:3em;">🏗</span>A minimalistic web application and its server both of them with [TS](https://www.typescriptlang.org/). 

## 💡 Rational

Using only [Typescript](https://www.typescriptlang.org/), create from scratch:
- a web application, without any dependency,
- a web server with as few dependencies as possible.

The web server provides very basic services for:
- bare module import resolving using [import maps](https://github.com/WICG/import-maps) with:
  - [es-module-shims](https://www.npmjs.com/package/es-module-shims),
- hot-reloading with:
  - [Node.js' http](https://nodejs.org/api/http.html), 
  - [ws](https://www.npmjs.com/package/ws), a WebSocket client and server implementation,
  - [chokidar](https://www.npmjs.com/package/chokidar), to watch code files (see below).

No [Webpack](https://webpack.js.org/), [Bazel](https://bazel.build/) or any other build manager.

No test. No lint.

Some more convenient packages ([concurrently](https://www.npmjs.com/package/concurrently), [cpy-cli](https://www.npmjs.com/package/cpy-cli), ...) are enough:
- to manage the files,
- to launch the application and open it on a browser.

All the scripts provided (start, serve, build, clean, ...) are cross-platform.

## 🏁 Quickstart

This project uses [yarn](https://yarnpkg.com/) as package manager. But it can be used equally with [npm](https://www.npmjs.com/).

### Prerequisites

- node >=12.0.0
- yarn >=1.13.0

### Install

```bash
yarn clone https://github.com/atao60/minimal-ts-web-client-server

cd minimal-ts-web-client-server

yarn install

```

### Usage

To start the server and open the application in a new tab under your default browser:

```bash

yarn start

```

You are then ready to try any change you wish. The view on the browser will be refreshed as soon as you save yours changes.

Then <kbd>Ctrl</kbd>+<kbd>c</kbd> to shut down the server.

## 🎹 Some explanation

As long as an html page doesn't need to download anything after its initial loading, there is no need to work with a server. But with hot reloading, it's required.

All the source are under folder `src` and the generated ones put under `public`. Even if no build manager is used, some tasks must be done:
- delete the folder `public`,
- copy the static files (css and html),
- translate from TS to ES.

For the web app, the target is ES5, so no worry about browsers not so recent. Otherwise, ie for tools and server, it's ES next. So a recent version of Node is required.

As a server is used, it's possible to load ES6 module:
- the browser will make an HTTP `request` to the server for the file being referenced through either a '\<script type="module" ... \>' or an 'import',
- no need to specify file extensions: the server will add the '.js' extension when required.


## ⭐️ Show your support

Give a ⭐️ if this project helped you!

## 🛠️ Development

### Contributing
Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/atao60/minimal-ts-web-client-server/issues). You can also take a look at the [contributing guide](https://github.com/atao60/minimal-ts-web-client-server/blob/master/CONTRIBUTING.md).

See [Contributing](CONTRIBUTING.md).

### Commented code

The server code doesn't contain any comment. Fortunately an heavily commented version is available. Furthermore, thanks to the script `strip-comments`, this version can be used to generate the uncommented code:

```
yarn redo:server

yarn start
```

> [Node fs](https://nodejs.org/api/fs.html).watch function is replaced with `chokidar`'s one to get a working cross-platform `--recursive` option.  
To be fully cross-platform, the [Node fs](https://nodejs.org/api/fs.html) module itself is replaced with [graceful-fs](https://www.npmjs.com/package/graceful-fs).

## 🛡 License

[MIT](LICENSE)

## 📜 Credits

* [Minimal (yes, truly) TypeScript setup](https://dev.to/alephnaught2tog/minimal-yes-truly-typescript-setup-lil), M. Shemayev, Jan 5 '19 

* [Dependency-free Typescript setup](https://github.com/aleph-naught2tog/ts_without_dependencies)

* [Dependency-free Typescript setup: The Sequel](https://github.com/aleph-naught2tog/reloading_ts_without_dependencies)
