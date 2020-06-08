# CSS Import Resolve [<img src="https://jonneal.dev/css-logo.svg" alt="CSS Logo" width="90" height="90" align="right">][css import resolve]

[<img alt="NPM Version" src="https://img.shields.io/npm/v/css-import-resolve.svg" height="20">][npm-url]
[<img alt="Build Status" src="https://img.shields.io/travis/csstools/css-import-resolve/master.svg" height="20">][cli-url]
[<img alt="Support Chat" src="https://img.shields.io/badge/chat-gitter-blue.svg" height="20">][git-url]

[CSS Import Resolve] is an algorithm for resolving imports in CSS.

See the [CSS Import Resolve specification] for more details.

```bash
npm install css-import-resolve
```

```js
import { resolveAsync } from 'css-import-resolve'

// where `id` is location stylesheet you are resolving, and
const id = 'path/to/css'

// where `cwd` is the current working directory
const cwd = process.cwd()

resolveAsync(id, cwd).then(file => { /* file is an absolute path */ })
```

## Resolve Algorithm

When `@import` is called, the following high-level algorithm is used to resolve
the location of the CSS file, found within `url(id)` from `cwd`:

1. if `id` begins with `/`
   1. `cwd` is the filesystem root
2. resolve [as a file](#resolve-as-a-file) using `cwd/id` as `file`
3. otherwise, resolve [as a directory](#resolve-as-a-directory) using `cwd/id`
   as `dir`
4. otherwise, if `id` does not begin with `/`, `./`, or `../`
   1. resolve [as a module](#resolve-as-a-module) using `cwd` and `id`
5. otherwise, throw `"CSS Module not found"`

### Resolve as a File

1. resolve `file` as the file
2. otherwise, resolve `file.css` as the file

### Resolve as a Directory

1. resolve the JSON contents of `dir/package.json` as `pkg`
   1. if `pkg` has an `exports.css.import` field
      1. resolve `dir/pkg.exports.css.import` as the file
   2. if `pkg` has an `exports.css.default` field
      1. resolve `dir/pkg.exports.css.default` as the file
   3. if `pkg` has an `exports.css` field
      1. resolve `dir/pkg.exports.css` as the file
   4. if `pkg` has a `style` field
      1. resolve `dir/pkg.style` as the file
   5. otherwise, resolve `dir/index.css` as the file

### Resolve as a Module

1. for each `dir` in the [node modules directory](#node-modules-directory)
   using `cwd`
   1. resolve [as a file](#resolve-as-a-file) using `dir/id` as `file`
   2. otherwise, resolve [as a directory](#resolve-as-a-directory) using
      `dir/id` as `dir`

### Node Modules Directory

1. `segments` is `cwd` split by `/`
2. `count` is the length of `segments`
3. `dirs` is an empty list
4. while `count` is greater than `0`
   1. if `segments[count]` is not `node_modules`
      1. push a new item to `dirs` as the `/`-joined `segments[0 - count]` and
         `node_modules`
   2. `count` is `count` minus `1`
5. return `dirs`

## resolveSync

```js
import { resolveSync } from 'css-import-resolve'

const fileOrNull = resolveSync('path/to/css', process.cwd())
```

## Options

```js
import { resolveSync } from 'css-import-resolve'

const id = 'path/to/css'
const cwd = process.cwd()

// resolve files as css modules
const opts = {
  extensions: ['module.css'],
  indexes: ['index.module.css'],
  packageProps: ['exports.icss.import', 'exports.icss.default', 'exports.icss']
}

resolveSync(id, cwd, opts)
```

#### baseUrl

The `baseUrl` parameter sets the base directory used by non-relative paths during resolution.

#### extensions

The `extensions` parameter sets the list of file extensions checked during resolution. Its default value is `["css"]`.

#### indexes

The `index` parameter sets the list of index files in a directory that are checked during resolution. Its default value is `["index.css"]`.

#### packageProps

The `packageProps` parameter sets the list of fields in a `package.json` that are checked during resolution. Its default value is `["exports.css.import", "exports.css.default", "exports.css", "style"]`.

#### fileResolverAsyncCache

The `fileResolverAsyncCache` parameter sets the object used to cache asynchronous results during resolution, allowing duplicate checks to resolve without revisiting a file system.

#### fileResolverSyncCache

The `fileResolverSyncCache` parameter sets the object used to cache asynchronous results during resolution, allowing duplicate checks to resolve without revisiting a file system.

[css import resolve]: https://github.com/csstools/css-import-resolve
[css import resolve specification]: https://csstools.github.io/css-import-resolve/
[cli-url]: https://travis-ci.org/csstools/css-import-resolve
[git-url]: https://gitter.im/postcss/postcss
[npm-url]: https://www.npmjs.com/package/css-import-resolve
