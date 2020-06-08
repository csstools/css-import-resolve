/**
 * Return a resolved file object if a file exists, otherwise a rejection.
 * @arg {string} file
 * @arg {Options} opts
 * @return {SettledPathAsync}
 */

export function resolveAsFileAsync(file, opts) {
	return (
		// resolve `file` as the file
		opts.fileResolverAsync(file, opts).catch(
			// otherwise, for each `fileExtension` of `extensions`
			() =>
				opts.extensions.reduce(
					(fileInfoAsync, fileExtension) =>
						fileInfoAsync.catch(
							// resolve `file.fileExtension` as the file
							() => opts.fileResolverAsync(`${file}.${fileExtension}`, opts)
						),
					Promise.reject()
				)
		)
	)
}

/**
 * Return a file object if a file exists, otherwise null.
 * @arg {string} file
 * @arg {Options} opts
 * @return {SettledPathSync}
 */

export function resolveAsFileSync(file, opts) {
	return (
		// resolve `file` as the file
		opts.fileResolverSync(file, opts) ||
		// otherwise, for each `fileExtension` of `extensions`
		opts.extensions.reduce(
			(fileInfoSync, fileExtension) =>
				fileInfoSync ||
				// resolve `file.fileExtension` as the file
				opts.fileResolverSync(`${file}.${fileExtension}`, opts),
			null
		)
	)
}

/** @typedef {string | void} SettledPathSync */
/** @typedef {Promise<string | Error>} SettledPathAsync */
/** @typedef {{ baseUrl: string, extensions: string[], fileResolverAsync: (file: string, opts: Options) => SettledPathAsync, fileResolverAsyncCache: Object<string, SettledPathAsync>, fileResolverSync: (file: string, opts: Options) => SettledPathSync, fileResolverSyncCache: Object<string, SettledPathSync>, indexes: string[], packageProps: string[], packageResolverAsync: (pkg: Object<string, any>, opts: Options) => Promise<string | void>, packageResolverSync: (pkg: Object<string, any>, opts: Options) => string | void, pathSeparator: string }} Options */
