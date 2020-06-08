import { resolveAsync, resolveSync } from './lib/resolve.js'

const resolve = {
	async: resolveAsync,
	sync: resolveSync
}

export { resolveAsync, resolveSync, resolve as default }
