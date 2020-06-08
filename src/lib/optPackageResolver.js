/**
 * Resolve the package value, otherwise rejection.
 * @arg {Object<string, any>} pkg
 * @return {Promise<string | void>}
 */

export function packageResolverAsync(pkg, opts) {
	const value = packageResolverSync(pkg, opts)

	return value ? Promise.resolve(value) : Promise.reject()
}

/**
 * Return the package value, otherwise null.
 * @arg {Object<string, any>} pkg
 * @return {string | void}
 */

export function packageResolverSync(pkg, opts) {
	const value = opts.packageProps.reduce(
		(packageValue, packageProp) =>
			packageValue || packageProp.split('.').reduce((object, field) => Object(object)[field], pkg),
		null
	)

	return typeof value === 'string' ? value : null
}
