# CSS Import Resolve [<img src="https://jonathantneal.github.io/css-import-resolve/css-logo.svg" alt="CSS Logo" width="52" height="52" align="right">][CSS Import Resolve]

[CSS Import Resolve] is an algorithm for resolving imports in CSS.

See the [CSS Import Resolve specification] for more details.

```bash
npm install css-import-resolve
```

```js
import resolve from 'css-import-resolve';

// where `id` is location stylesheet you are resolving, and
// where `cwd` is the current working directory
resolve(id, process.cwd());
```

[CSS Import Resolve]: https://jonathantneal.github.io/css-import-resolve/
[CSS Import Resolve specification]: https://jonathantneal.github.io/css-import-resolve/
