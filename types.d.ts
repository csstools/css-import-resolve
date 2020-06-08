declare function resolveAsync(id: string, cwd: string, init: resolve.Options): resolve.SettledPathAsync

declare function resolveSync(id: string, cwd: string, init: resolve.Options): resolve.SettledPathSync

declare namespace resolve {
	type SettledPathAsync = Promise<string | Error>
	type SettledPathSync = string | void

	interface Options {
		/** Base directory used by non-relative paths during resolution. */
		baseUrl: string,

		/** List of file extensions checked during resolution. */
		extensions: string[],

		/** Function that resolves or rejects a file path if it exists. */
		fileResolverAsync: (file: string, opts: Options) => SettledPathAsync,

		/** Object used to cache asynchronous results during resolution. */
		fileResolverAsyncCache: { [key: string]: SettledPathAsync },

		/** Function that returns a file path or null if it exists. */
		fileResolverSync: (file: string, opts: Options) => SettledPathSync,

		/** Object used to cache synchronous results during resolution. */
		fileResolverSyncCache: { [key: string]: SettledPathSync },

		/** List of index files in a directory that are checked during resolution. */
		indexes: string[],

		/** List of fields in a `package.json` that are checked during resolution. */
		packageProps: string[],

		/** Function that resolves a file path if it exists and otherwise rejects. */
		packageResolverAsync: (pkg: { [key: string]: any }, opts: Options) => Promise<string | void>,

		/** Function that returns a file path if it exists and otherwise returns null. */
		packageResolverSync: (pkg: { [key: string]: any }, opts: Options) => string | void,

		/** Path segment separator. */
		pathSeparator: string
	}
}
