import { join } from 'path'
import { has, startsWithRelative, startsWithRoot } from './utils.js'
import { fileStatAsync, fileStatSync } from './optFileResolver.js'
import { packageResolverAsync, packageResolverSync } from './optPackageResolver.js'
import { resolveAsFileAsync, resolveAsFileSync } from './resolveAsFile.js'
import { resolveAsDirectoryAsync, resolveAsDirectorySync } from './resolveAsDirectory.js'
import { resolveAsModuleAsync, resolveAsModuleSync } from './resolveAsModule.js'

const defaultextensions = ['css']
const defaultIndexes = ['index.css']
const defaultPackageProps = ['exports.css.import', 'exports.css.default', 'exports.css', 'style']
const defaultPathSeparator = '/'

/**
 * Resolve the location of a file within `url(id)` from `cwd`
 * @arg {string} id
 * @arg {string} cwd
 * @arg {Partial<Options>} init
 * @return {SettledPathAsync}
 */

export function resolveAsync(id, cwd, init) {
	/** @type {Options} */
	const opts = init === Object(init) ? init : {}

	if (!has(opts, 'baseUrl')) opts.baseUrl = cwd
	if (!has(opts, 'extensions')) opts.extensions = defaultextensions
	if (!has(opts, 'indexes')) opts.indexes = defaultIndexes
	if (!has(opts, 'fileResolverAsync')) opts.fileResolverAsync = fileStatAsync
	if (!has(opts, 'fileResolverAsyncCache')) opts.fileResolverAsyncCache = Object.create(null)
	if (!has(opts, 'fileResolverSync')) opts.fileResolverSync = fileStatSync
	if (!has(opts, 'fileResolverSyncCache')) opts.fileResolverSyncCache = Object.create(null)
	if (!has(opts, 'packageProps')) opts.packageProps = defaultPackageProps
	if (!has(opts, 'packageResolverAsync')) opts.packageResolverAsync = packageResolverAsync
	if (!has(opts, 'packageResolverSync')) opts.packageResolverSync = packageResolverSync
	if (!has(opts, 'pathSeparator')) opts.pathSeparator = defaultPathSeparator

	// if `id` starts with `/`
	if (startsWithRoot(id, opts)) {
		// `cwd` is the filesystem root
		cwd = ''
	}

	return (
		// resolve as a file using `cwd/id` as `file`
		resolveAsFileAsync(join(cwd, id), opts)
			// otherwise, resolve as a directory using `cwd/id` as `dir`
			.catch(() => resolveAsDirectoryAsync(join(cwd, id), opts))
			.catch(() =>
				// otherwise, if `id` does not begin with `/`, `./`, or `../` then resolve as a module using `cwd` and `id`
				!startsWithRelative(id, opts)
					? opts.baseUrl !== cwd
						? resolveAsFileAsync(join(opts.baseUrl, id), opts)
						: resolveAsModuleAsync(cwd, id, opts)
					: Promise.reject()
			)
			.catch(
				// otherwise, throw `"CSS Module not found"`
				() => Promise.reject(new Error('CSS Module not found'))
			)
	)
}

/**
 * Return the location of a file within `url(id)` from `cwd`
 * @arg {string} id
 * @arg {string} cwd
 * @arg {Partial<Options>} init
 * @return {SettledPathSync}
 */

export function resolveSync(id, cwd, init) {
	/** @type {Options} */
	const opts = init === Object(init) ? init : {}

	if (!has(opts, 'baseUrl')) opts.baseUrl = cwd
	if (!has(opts, 'extensions')) opts.extensions = defaultextensions
	if (!has(opts, 'indexes')) opts.indexes = defaultIndexes
	if (!has(opts, 'fileResolverAsync')) opts.fileResolverAsync = fileStatAsync
	if (!has(opts, 'fileResolverAsyncCache')) opts.fileResolverAsyncCache = Object.create(null)
	if (!has(opts, 'fileResolverSync')) opts.fileResolverSync = fileStatSync
	if (!has(opts, 'fileResolverSyncCache')) opts.fileResolverSyncCache = Object.create(null)
	if (!has(opts, 'packageProps')) opts.packageProps = defaultPackageProps
	if (!has(opts, 'packageResolverAsync')) opts.packageResolverAsync = packageResolverAsync
	if (!has(opts, 'packageResolverSync')) opts.packageResolverSync = packageResolverSync
	if (!has(opts, 'pathSeparator')) opts.pathSeparator = defaultPathSeparator

	// if `id` starts with `/`
	if (startsWithRoot(id, opts)) {
		// `cwd` is the filesystem root
		cwd = ''
	}

	return (
		// return as a file using `cwd/id` as `file`
		resolveAsFileSync(join(cwd, id), opts) ||
		// otherwise, return as a directory using `cwd/id` as `dir`
		resolveAsDirectorySync(join(cwd, id), opts) ||
		// otherwise, if `id` does not begin with `/`, `./`, or `../` then return as a module using `cwd` and `id`
		(!startsWithRelative(id, opts)
			? opts.baseUrl !== cwd
				? resolveAsFileSync(join(opts.baseUrl, id), opts)
				: resolveAsModuleSync(cwd, id, opts)
			: null) ||
		// otherwise, return null
		null
	)
}

/** @typedef {string | void} SettledPathSync */
/** @typedef {Promise<string | Error>} SettledPathAsync */
/** @typedef {{ baseUrl: string, extensions: string[], fileResolverAsync: (file: string, opts: Options) => SettledPathAsync, fileResolverAsyncCache: Object<string, SettledPathAsync>, fileResolverSync: (file: string, opts: Options) => SettledPathSync, fileResolverSyncCache: Object<string, SettledPathSync>, indexes: string[], packageProps: string[], packageResolverAsync: (pkg: Object<string, any>, opts: Options) => Promise<string | void>, packageResolverSync: (pkg: Object<string, any>, opts: Options) => string | void, pathSeparator: string }} Options */
