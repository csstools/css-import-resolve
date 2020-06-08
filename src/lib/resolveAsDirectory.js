import { join, parseJson, readAsync, readSync } from './utils.js'

/**
 * Return a resolved file path if a file exists, otherwise a rejection.
 * @arg {string} dir
 * @arg {Options} opts
 * @return {SettledPathAsync}
 */

export function resolveAsDirectoryAsync(dir, opts) {
	// if package.json exists
	return readAsync(join(dir, 'package.json'), 'utf8').then(
		contents => {
			// resolve the JSON contents of `dir/package.json` as `pkg`
			const pkg = parseJson(contents)

			// if `pkg` has the resolved file field
			return opts.packageResolverAsync(pkg, opts).then(
				// resolve the resolved file field as the file
				file => opts.fileResolverAsync(join(dir, file), opts),
				// otherwise, resolve by file index
				resolveByindexAsync
			)
		},
		// otherwise, resolve by file index
		resolveByindexAsync
	)

	function resolveByindexAsync() {
		// for each `index` of `indexes`
		return opts.indexes.reduce(
			(fileInfoAsync, index) =>
				fileInfoAsync.catch(
					// resolve `dir/index` as the file
					() => opts.fileResolverAsync(join(dir, index), opts)
				),
			Promise.reject()
		)
	}
}

/**
 * Return a file path if a file exists, otherwise null.
 * @arg {string} dir
 * @arg {Options} opts
 * @return {SettledPathSync}
 */

export function resolveAsDirectorySync(dir, opts) {
	const contents = readSync(join(dir, 'package.json'), 'utf8')

	// if package.json exists
	if (contents) {
		// resolve the JSON contents of `dir/package.json` as `pkg`
		const pkg = parseJson(contents)

		const file = opts.packageResolverSync(pkg, opts)

		// if `pkg` has the resolved file field
		if (file) {
			// resolve the resolved file field as the file
			return opts.fileResolverSync(join(dir, file), opts)
		}
	}

	// otherwise, resolve by file index
	return resolveByIndexSync()

	function resolveByIndexSync() {
		// for each `index` of `indexes`
		return opts.indexes.reduce(
			(fileInfoSync, index) =>
				fileInfoSync ||
				// resolve `dir/index` as the file
				opts.fileResolverSync(join(dir, index), opts),
			null
		)
	}
}

/** @typedef {string | void} SettledPathSync */
/** @typedef {Promise<string | Error>} SettledPathAsync */
/** @typedef {{ baseUrl: string, extensions: string[], fileResolverAsync: (file: string, opts: Options) => SettledPathAsync, fileResolverAsyncCache: Object<string, SettledPathAsync>, fileResolverSync: (file: string, opts: Options) => SettledPathSync, fileResolverSyncCache: Object<string, SettledPathSync>, indexes: string[], packageProps: string[], packageResolverAsync: (pkg: Object<string, any>, opts: Options) => Promise<string | void>, packageResolverSync: (pkg: Object<string, any>, opts: Options) => string | void, pathSeparator: string }} Options */
