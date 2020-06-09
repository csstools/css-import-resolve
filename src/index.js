import { resolveAsync, resolveSync } from './lib/resolve.js'

const resolve = {
	async: resolveAsync,
	sync: resolveSync
}

export { resolve as default, resolveAsync, resolveSync }
