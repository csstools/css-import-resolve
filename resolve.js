import { readFile } from 'fs'
import { join, sep } from 'path'

export default resolve

/* Resolve the location of a file within `url(id)` from `cwd`
/* ========================================================================== */

function resolve(id, cwd, cache) {
	cache = cache || {}

	// if `id` starts with `/`
	if (startsWithRoot(id)) {
		// `cwd` is the filesystem root
		cwd = ''
	}

	// resolve as a file using `cwd/id` as `file`
	return resolveAsFile(join(cwd, id), cache)
	// otherwise, resolve as a directory using `cwd/id` as `dir`
	.catch(() => resolveAsDirectory(join(cwd, id), cache))
	// otherwise, if `id` does not begin with `/`, `./`, or `../`
	.catch(() => !startsWithRelative(id)
		// resolve as a module using `cwd` and `id`
		? resolveAsModule(cwd, id, cache)
		: Promise.reject()
	)
	// otherwise, throw `"CSS Module not found"`
	.catch(() => Promise.reject(new Error('CSS Module not found')))
}

function resolveAsFile(file, cache) {
	// resolve `file` as the file
	return fileContents(file, cache)
	// otherwise, resolve `file.css` as the file
	.catch(() => fileContents(`${file}.css`, cache))
}

function resolveAsDirectory(dir, cache) {
	// resolve the JSON contents of `dir/package.json` as `pkg`
	return jsonContents(dir, cache).then(
		// if `pkg` has a `style` field
		pkg => 'style' in pkg
			// resolve `dir/pkg.style` as the file
			? fileContents(join(dir, pkg.style), cache)
		// otherwise, resolve `dir/index.css` as the file
		: fileContents(join(dir, 'index.css'), cache)
	)
}

function resolveAsModule(cwd, id, cache) {
	// for each `dir` in the node modules directory using `cwd`
	return nodeModulesDirs(cwd).reduce(
		(promise, dir) => promise.catch(
			// resolve as a file using `dir/id` as `file`
			() => resolveAsFile(join(dir, id), cache)
			// otherwise, resolve as a directory using `dir/id` as `dir`
			.catch(() => resolveAsDirectory(join(dir, id), cache))
		),
		Promise.reject()
	)
}

function nodeModulesDirs(cwd) {
	// segments is `cwd` split by `/`
	const segments = cwd.split(sep)

	// `count` is the length of segments
	let count = segments.length

	// `dirs` is an empty list
	const dirs = []

	// while `count` is greater than `0`
	while (count > 0) {
		// if `segments[count]` is not `node_modules`
		if (segments[count] !== 'node_modules') {
			// push a new path to `dirs` as the `/`-joined `segments[0 - count]` and `node_modules`
			dirs.push(
				join(segments.slice(0, count).join('/') || '/', 'node_modules')
			)
		}

		// `count` is `count` minus `1`
		--count
	}

	// return `dirs`
	return dirs
}

/* Additional tooling
/* ========================================================================== */

function fileContents(file, cache) {
	cache[file] = cache[file] || new Promise(
		(resolvePromise, rejectPromise) => readFile(file, 'utf8', (error, contents) => error
			? rejectPromise(error)
			: resolvePromise({
				file,
				contents
			})
		)
	)

	return cache[file]
}

function jsonContents(dir, cache) {
	const file = join(dir, 'package.json')

	return fileContents(file, cache).then(
		({ contents }) => JSON.parse(contents)
	)
}

function startsWithRoot(id) {
	return /^\//.test(id)
}

function startsWithRelative(id) {
	return /^\.{0,2}\//.test(id)
}
