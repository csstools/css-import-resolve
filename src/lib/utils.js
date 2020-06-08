import { accessSync as fsAccessSync, readFileSync as fsReadSync, statSync as fsStatSync } from 'fs'
import { join } from 'path'
import { promises } from 'fs'

export { constants } from 'fs'
export { join } from 'path'

export const { access: accessAsync, readFile: readAsync, stat: statAsync } = promises

export const error = new Error('CSS Module not found')
export const has = Function.call.bind(hasOwnProperty)

/**
 * Returns an object from JavaScript Object Notation (JSON).
 * @arg {string} json
 * @return {Object<string, any>}
 */

export function parseJson(json) {
	try {
		return Object(JSON.parse(json))
	} catch (error) {
		return {}
	}
}

/**
 * Synchronously returns whether a file is accessible to the user.
 * @arg {string} file
 * @arg {ReadFileSyncOptions} options
 * @return {boolean | void}
 */

export function accessSync(file, mode) {
	try {
		return fsAccessSync(file, mode) || true
	} catch (error) {
		return false
	}
}

/**
 * Synchronously returns the contents of a file, otherwise null.
 * @arg {string} file
 * @arg {ReadFileSyncOptions} options
 * @return {string | void}
 */

export function readSync(file, options) {
	try {
		return fsReadSync(file, options)
	} catch (error) {
		return null
	}
}

/**
 * Synchronously returns information about a file.
 * @arg {string} file
 * @arg {StatFileSystemOptions} options
 * @return {import('fs').BigIntStats | void}
 */

export function statSync(file, mode) {
	try {
		return fsStatSync(file, mode) || null
	} catch (error) {
		return null
	}
}

/**
 * Return whether the id starts with a root path separator.
 * @param {string} id
 * @param {Options} opts
 */

export function startsWithRoot(id, opts) {
	return RegExp('^\\' + opts.pathSeparator).test(id)
}

/**
 * Return whether the id starts with a relative path separator.
 * @param {string} id
 * @param {Options} opts
 */

export function startsWithRelative(id, opts) {
	return RegExp('^\\.{0,2}\\' + opts.pathSeparator).test(id)
}

/**
 * Return a list of possible "node_modules" directories.
 * @arg {string} cwd
 * @arg {Options} opts
 */
export function nodeModulesDirs(cwd, opts) {
	// segments is `cwd` split by `/`
	const segments = cwd.split(opts.pathSeparator)

	// `count` is the length of segments
	let count = segments.length

	// `dirs` is an empty list
	const dirs = []

	// while `count` is greater than `0`
	while (count > 0) {
		// if `segments[count]` is not `node_modules`
		if (segments[count] !== 'node_modules') {
			// push a new path to `dirs` as the `/`-joined `segments[0 - count]` and `node_modules`
			dirs.push(join(segments.slice(0, count).join(opts.pathSeparator) || opts.pathSeparator, 'node_modules'))
		}

		// `count` is `count` minus `1`
		--count
	}

	// return `dirs`
	return dirs
}

/** @typedef {{ encoding: BufferEncoding; flag?: string; } | BufferEncoding} ReadFileSyncOptions */
/** @typedef {{ bigint: boolean }} StatFileSystemOptions */
/** @typedef {string | void} SettledPathSync */
/** @typedef {Promise<string | Error>} SettledPathAsync */
/** @typedef {{ baseUrl: string, extensions: string[], fileResolverAsync: (file: string, opts: Options) => SettledPathAsync, fileResolverAsyncCache: Object<string, SettledPathAsync>, fileResolverSync: (file: string, opts: Options) => SettledPathSync, fileResolverSyncCache: Object<string, SettledPathSync>, indexes: string[], packageProps: string[], packageResolverAsync: (pkg: Object<string, any>, opts: Options) => Promise<string | void>, packageResolverSync: (pkg: Object<string, any>, opts: Options) => string | void, pathSeparator: string }} Options */
