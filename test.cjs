const path = require('path')
const { default: resolve } = require('./dist/index.cjs')

/* Resolve Tests
/* ========================================================================== */

;[
	// asynchronous tests
	// -------------------------------------------------------------------------
	{
		name: 'does resolve a css file/module (async)',
		test: () =>
			resolve
				.async('test/pass.css', process.cwd())
				.then(file => Promise[file === path.resolve('test/pass.css') ? 'resolve' : 'reject']()),
	},
	{
		name: 'does resolve a relative css file (async)',
		test: () =>
			resolve
				.async('./test/pass.css', process.cwd())
				.then(file => Promise[file === path.resolve('test/pass.css') ? 'resolve' : 'reject']()),
	},
	{
		name: 'does resolve a css file/module without an extension (async)',
		test: () =>
			resolve
				.async('test/pass', process.cwd())
				.then(file => Promise[file === path.resolve('test/pass.css') ? 'resolve' : 'reject']()),
	},
	{
		name: 'does resolve a icss file/module without an extension (async)',
		test: () =>
			resolve
				.async('test/pass', process.cwd(), {
					extensions: ['module.css'],
				})
				.then(file => Promise[file === path.resolve('test/pass.module.css') ? 'resolve' : 'reject']()),
	},
	{
		name: 'does resolve a relative css file without an extension (async)',
		test: () =>
			resolve
				.async('./test/pass', process.cwd())
				.then(file => Promise[file === path.resolve('test/pass.css') ? 'resolve' : 'reject']()),
	},
	{
		name: 'does resolve a relative icss file without an extension (async)',
		test: () =>
			resolve
				.async('./test/pass', process.cwd(), {
					extensions: ['module.css'],
				})
				.then(file => Promise[file === path.resolve('test/pass.module.css') ? 'resolve' : 'reject']()),
	},
	{
		name: 'does resolve a css file from package { exports } (async)',
		test: () =>
			resolve
				.async('./test/package-exports-test', process.cwd())
				.then(file =>
					Promise[file === path.resolve('test/pass.css') ? 'resolve' : 'reject'](
						[`expected: ${path.resolve('test/pass.css')}`, `received: ${file}`].join('\n')
					)
				),
	},
	{
		name: 'does resolve a icss file from package { exports } (async)',
		test: () =>
			resolve
				.async('./test/package-exports-test', process.cwd(), {
					packageProps: ['exports.icss.import', 'exports.icss.default', 'exports.icss'],
				})
				.then(file =>
					Promise[file === path.resolve('test/pass.module.css') ? 'resolve' : 'reject'](
						[`expected: ${path.resolve('test/pass.module.css')}`, `received: ${file}`].join('\n')
					)
				),
	},
	{
		name: 'does resolve a css file from package { style } (async)',
		test: () =>
			resolve
				.async('./test/package-style-test', process.cwd())
				.then(file =>
					Promise[file === path.resolve('test/pass.css') ? 'resolve' : 'reject'](
						[`expected: ${path.resolve('test/pass.css')}`, `received: ${file}`].join('\n')
					)
				),
	},
	{
		name: 'does resolve a icss file from package { style } (async)',
		test: () =>
			resolve
				.async('./test/package-style-test', process.cwd(), {
					packageProps: ['exports.icss.import', 'exports.icss.default', 'exports.icss'],
				})
				.then(file =>
					Promise[file === path.resolve('test/pass.module.css') ? 'resolve' : 'reject'](
						[`expected: ${path.resolve('test/pass.module.css')}`, `received: ${file}`].join('\n')
					)
				),
	},
	{
		name: 'does resolve a css file from a directory (async)',
		test: () =>
			resolve
				.async('./test/index-test', process.cwd())
				.then(file => Promise[file === path.resolve('test/index-test/index.css') ? 'resolve' : 'reject']()),
	},
	{
		name: 'does resolve a icss file from a directory (async)',
		test: () =>
			resolve
				.async('./test/index-test', process.cwd(), {
					indexes: ['index.module.css'],
				})
				.then(file => Promise[file === path.resolve('test/index-test/index.module.css') ? 'resolve' : 'reject']()),
	},
	{
		name: 'does not resolve a non-existent file or module (async)',
		test: () =>
			resolve.async('test/fail-x', process.cwd()).then(
				() => Promise.reject('File was found, and it should not have been found.'),
				error => (error.message === 'CSS Module not found' ? error.message : Promise.reject(error))
			),
	},
	{
		name: 'does not resolve a non-existent file (async)',
		test: () =>
			resolve.async('./test/fail-x', process.cwd()).then(
				() => Promise.reject('File was found, and it should not have been found.'),
				error => (error.message === 'CSS Module not found' ? error.message : Promise.reject(error))
			),
	},
	{
		name: 'does resolve a css file/module with { baseUrl } (async)',
		test: () =>
			resolve
				.async('test/pass.css', path.join(process.cwd(), 'test'), {
					baseUrl: process.cwd(),
				})
				.then(file => Promise[file === path.resolve('test/pass.css') ? 'resolve' : 'reject']()),
	},
	{
		name: 'does not resolve a css file/module without { baseUrl } (async)',
		test: () =>
			resolve.async('test/pass.css', path.join(process.cwd(), 'test')).then(
				() => Promise.reject('File was found, and it should not have been found.'),
				error => (error.message === 'CSS Module not found' ? error.message : Promise.reject(error))
			),
	},
	// synchronous tests
	// -------------------------------------------------------------------------
	{
		name: 'does return a css file/module (sync)',
		test: () =>
			Promise[resolve.sync('test/pass.css', process.cwd()) === path.resolve('test/pass.css') ? 'resolve' : 'reject'](),
	},
	{
		name: 'does resolve a relative css file (sync)',
		test: () =>
			Promise[
				resolve.sync('./test/pass.css', process.cwd()) === path.resolve('test/pass.css') ? 'resolve' : 'reject'
			](),
	},
	{
		name: 'does resolve a css file/module without an extension (sync)',
		test: () =>
			Promise[resolve.sync('test/pass', process.cwd()) === path.resolve('test/pass.css') ? 'resolve' : 'reject'](),
	},
	{
		name: 'does resolve a icss file/module without an extension (sync)',
		test: () =>
			Promise[
				resolve.sync('test/pass', process.cwd(), { extensions: ['module.css'] }) ===
				path.resolve('test/pass.module.css')
					? 'resolve'
					: 'reject'
			](),
	},
	{
		name: 'does resolve a relative css file without an extension (sync)',
		test: () =>
			Promise[resolve.sync('./test/pass', process.cwd()) === path.resolve('test/pass.css') ? 'resolve' : 'reject'](),
	},
	{
		name: 'does resolve a relative icss file without an extension (sync)',
		test: () =>
			Promise[
				resolve.sync('./test/pass', process.cwd(), { extensions: ['module.css'] }) ===
				path.resolve('test/pass.module.css')
					? 'resolve'
					: 'reject'
			](),
	},
	{
		name: 'does resolve a css file from package { exports } (sync)',
		test: () =>
			Promise[
				resolve.sync('test/package-exports-test', process.cwd()) === path.resolve('test/pass.css')
					? 'resolve'
					: 'reject'
			](),
	},
	{
		name: 'does resolve a icss file from package { exports } (sync)',
		test: () =>
			Promise[
				resolve.sync('test/package-exports-test', process.cwd(), {
					packageProps: ['exports.icss.import', 'exports.icss.default', 'exports.icss'],
				}) === path.resolve('test/pass.module.css')
					? 'resolve'
					: 'reject'
			](),
	},
	{
		name: 'does resolve a css file from package { style } (sync)',
		test: () =>
			Promise[
				resolve.sync('test/package-style-test', process.cwd()) === path.resolve('test/pass.css') ? 'resolve' : 'reject'
			](),
	},
	{
		name: 'does resolve a icss file from package { style } (sync)',
		test: () =>
			Promise[
				resolve.sync('test/package-style-test', process.cwd(), {
					packageProps: ['exports.icss.import', 'exports.icss.default', 'exports.icss'],
				}) === path.resolve('test/pass.module.css')
					? 'resolve'
					: 'reject'
			](),
	},
	{
		name: 'does resolve a css file from a directory (sync)',
		test: () =>
			Promise[
				resolve.sync('test/index-test', process.cwd()) === path.resolve('test/index-test/index.css')
					? 'resolve'
					: 'reject'
			](),
	},
	{
		name: 'does resolve a icss file from a directory (sync)',
		test: () =>
			Promise[
				resolve.sync('test/index-test', process.cwd(), {
					indexes: ['index.module.css'],
				}) === path.resolve('test/index-test/index.module.css')
					? 'resolve'
					: 'reject'
			](),
	},
	{
		name: 'does resolve a css file/module with { baseUrl } (sync)',
		test: () =>
			Promise[
				resolve.sync('test/pass.css', path.join(process.cwd(), 'test'), {
					baseUrl: process.cwd(),
				}) === path.resolve('test/pass.css')
					? 'resolve'
					: 'reject'
			](),
	},
	{
		name: 'does not resolve a non-existent file or module (sync)',
		test: () => Promise[resolve.sync('test/fail-x', process.cwd()) === null ? 'resolve' : 'reject'](),
	},
	{
		name: 'does not resolve a non-existent file (sync)',
		test: () => Promise[resolve.sync('./test/fail-x', process.cwd()) === null ? 'resolve' : 'reject'](),
	},
	{
		name: 'does not resolve a css file/module without { baseUrl } (sync)',
		test: () =>
			Promise[
				resolve.sync('test/pass.css', path.join(process.cwd(), 'test')) === null
					? 'resolve'
					: 'reject'
			](),
	},
]
	.reduce(test, Promise.resolve(true))
	.then(done)

/* Additional tooling
/* ========================================================================== */

function test(promise, entry) {
	const name = entry.name
	const fn = entry.test
	const isWin32 = process.platform === 'win32'
	const tick = isWin32 ? '√' : '✔'
	const cross = isWin32 ? '×' : '✖'

	return promise.then(status => {
		process.stdout.write(`  ─ ${name} `)

		return fn()
			.then(() => {
				process.stdout.write(`${tick}\n`)

				return status
			})
			.catch(error => {
				process.stdout.write(`${cross}\n\n${error}\n\n`)

				return false
			})
	})
}

function done(status) {
	process.exit(status ? 0 : 1)
}
