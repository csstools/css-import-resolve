# CSS Import Resolve [<img src="https://jonneal.dev/css-logo.svg" alt="CSS Logo" width="90" height="90" align="right">][CSS Import Resolve]

[<img alt="NPM Version" src="https://img.shields.io/npm/v/css-import-resolve.svg" height="20">][npm-url]
[<img alt="Build Status" src="https://img.shields.io/travis/csstools/css-import-resolve/master.svg" height="20">][cli-url]
[<img alt="Support Chat" src="https://img.shields.io/badge/chat-gitter-blue.svg" height="20">][git-url]

[CSS Import Resolve] is an algorithm for resolving imports in CSS.

See the [CSS Import Resolve specification] for more details.

```bash
npm install css-import-resolve
```

```js
import resolve from 'css-import-resolve'

// where `id` is location stylesheet you are resolving, and
// where `cwd` is the current working directory
resolve(id, process.cwd())
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
   1. if `pkg` has a `style` field
      1. resolve `dir/pkg.style` as the file
   3. otherwise, resolve `dir/index.css` as the file

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

[CSS Import Resolve]: https://jonathantneal.github.io/css-import-resolve/
[CSS Import Resolve specification]: https://jonathantneal.github.io/css-import-resolve/

[cli-url]: https://travis-ci.org/csstools/css-import-resolve
[git-url]: https://gitter.im/postcss/postcss
[npm-url]: https://www.npmjs.com/package/css-import-resolve
