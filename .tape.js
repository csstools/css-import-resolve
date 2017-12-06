const resolve = require('.');

/* Resolve Tests
/* ========================================================================== */

[{
	name: 'will resolve a css file',
	test: () => resolve('test/pass-1.css', process.cwd(), {})
},
{
	name: 'will resolve a css file without an extension',
	test: () => resolve('test/pass-1', process.cwd(), {})
},
{
	name: 'will not resolve a non-existent file',
	test: () => resolve('test/fail-x', process.cwd(), {}).then(
		() => Promise.reject(),
		error => error.message === 'CSS Module not found' ? error.message : Promise.reject(error)
	)
}].reduce(test, Promise.resolve(true)).then(done);

/* Additional tooling
/* ========================================================================== */

function test(promise, entry, index) {
	const name = entry.name;
	const fn = entry.test;
	const isWin32 = process.platform === 'win32';
	const tick    = isWin32 ? '√' : '✔';
	const cross   = isWin32 ? '×' : '✖';

	return promise.then(status => {
		process.stdout.write(`  ─ ${name} `);

		return fn().then(result => {
			process.stdout.write(`${tick}\n`);

			return status;
		}).catch(error => {
			process.stdout.write(`${cross}\n\n${ error }\n\n`);

			return false;
		});
	});
}

function done(status) {
	if (status) {
		process.exit(0);
	} else {
		process.exit(1);
	}
}
