import { join } from 'path'
import { nodeModulesDirs } from './utils.js'
import { resolveAsFileAsync, resolveAsFileSync } from './resolveAsFile.js'
import { resolveAsDirectoryAsync, resolveAsDirectorySync } from './resolveAsDirectory.js'

/**
* Resolve a module.
* @arg {string} cwd
* @arg {string} id
* @arg {Options} opts
* @return {SettledPathAsync}
*/

export function resolveAsModuleAsync(cwd, id, opts) {
	// for each `dir` in the node modules directory using `cwd`
	return nodeModulesDirs(cwd, opts).reduce(
		(fileInfoAsync, dir) => fileInfoAsync.catch(
			// resolve as a file using `dir/id` as `file`
			() => resolveAsFileAsync(join(dir, id), opts)
			// otherwise, resolve as a directory using `dir/id` as `dir`
			.catch(
				() => resolveAsDirectoryAsync(join(dir, id), opts)
			)
		),
		Promise.reject()
	)
}

/**
* Resolve a module.
* @arg {string} cwd
* @arg {string} id
* @arg {Options} opts
* @return {SettledPathSync}
*/

export function resolveAsModuleSync(cwd, id, opts) {
	// for each `dir` in the node modules directory using `cwd`
	return nodeModulesDirs(cwd, opts).reduce(
		(fileInfoSync, dir) => (
			fileInfoSync ||
			// resolve as a file using `dir/id` as `file`
			resolveAsFileSync(join(dir, id), opts) ||
			// otherwise, resolve as a directory using `dir/id` as `dir`
			resolveAsDirectorySync(join(dir, id), opts)
		),
		null
	)
}

/** @typedef {string | void} SettledPathSync */
/** @typedef {Promise<string | Error>} SettledPathAsync */
/** @typedef {{ baseUrl: string, extensions: string[], fileResolverAsync: (file: string, opts: Options) => SettledPathAsync, fileResolverAsyncCache: Object<string, SettledPathAsync>, fileResolverSync: (file: string, opts: Options) => SettledPathSync, fileResolverSyncCache: Object<string, SettledPathSync>, indexes: string[], packageProps: string[], packageResolverAsync: (pkg: Object<string, any>, opts: Options) => Promise<string | void>, packageResolverSync: (pkg: Object<string, any>, opts: Options) => string | void, pathSeparator: string }} Options */
