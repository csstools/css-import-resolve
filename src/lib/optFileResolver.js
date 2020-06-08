import { has, statAsync, statSync } from './utils.js'

/**
 * Return a resolved path object if a file exists, otherwise a rejection.
 * @arg {string} file
 * @arg {Options} opts
 * @return {SettledPathAsync}
 */

export function fileStatAsync(file, opts) {
	if (!has(opts.fileResolverAsyncCache, file)) {
		opts.fileResolverAsyncCache[file] = statAsync(file).then(
			stat => (stat.isFile() ? file : Promise.reject())
		)
	}

	return opts.fileResolverAsyncCache[file]
}

/**
 * Return a path object if a file exists, otherwise null.
 * @arg {string} file
 * @arg {Options} opts
 * @return {SettledPathSync}
 */

export function fileStatSync(file, opts) {
	if (!has(opts.fileResolverSyncCache, file)) {
		const stat = statSync(file)

		opts.fileResolverSyncCache[file] = stat && stat.isFile() ? file : null
	}

	return opts.fileResolverSyncCache[file]
}

/** @typedef {string | void} SettledPathSync */
/** @typedef {Promise<string | Error>} SettledPathAsync */
/** @typedef {{ baseUrl: string, extensions: string[], fileResolverAsync: (file: string, opts: Options) => SettledPathAsync, fileResolverAsyncCache: Object<string, SettledPathAsync>, fileResolverSync: (file: string, opts: Options) => SettledPathSync, fileResolverSyncCache: Object<string, SettledPathSync>, indexes: string[], packageProps: string[], packageResolverAsync: (pkg: Object<string, any>, opts: Options) => Promise<string | void>, packageResolverSync: (pkg: Object<string, any>, opts: Options) => string | void, pathSeparator: string }} Options */
