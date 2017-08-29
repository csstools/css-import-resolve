import path from 'path';
import fse from 'fse';

export default function resolve(id, rawcwd) {
	// set cwd as the current working directory
	let cwd = rawcwd;

	// if id begins with /
	if (id[0] === '/') {
		// set cwd as the filesystem root
		cwd = '';
	}

	// resolve load_as_file(cwd/id)
	return load_as_file(path.join(cwd, id)).catch(
		// otherwise, resolve load_as_directory(cwd/id)
		() => load_as_directory(path.join(cwd, id))
	).catch(
		() => load_node_modules(id, path.dirname(cwd))
	).catch(
		() => Promise.reject('CSS Module not found')
	);
}

function load_as_file(id) {
	// resolve if id is a file
	return is_file(id).catch(
		// otherwise, resolve if id.css is a file
		() => is_file(`${id}.css`)
	);
}

function load_as_directory(id) {
	// if id/package.json is a file
	return is_file(path.join(id, 'package.json')).then(
		// parse id/package.json as pkg
		() => fse.readFile(path.join(id, 'package.json')).then(
			(json) => JSON.parse(json)
		)
	).then(
		// if style field exists in pkg
		(pkg) => 'style' in pkg
			// resolve load_as_file(id/pkg.style)
			? load_as_file(path.join(id, pkg.style))
		// otherwise, resolve load_index(id)
		: load_index(id)
	);
}

function load_node_modules(id, start) {
	return node_modules_paths(start).reduce(
		// for each dir in node_modules_paths(start):
		(promise, dir) => promise.catch(
			// resolve load_as_file(dir/id)
			() => load_as_file(path.join(dir, id)).catch(
				// resolve load_as_directory(dir/id)
				() => load_as_directory(path.join(dir, id))
			)
		),
		Promise.reject()
	);
}

function node_modules_paths(start) {
	// set parts as the split paths of start
	const parts = start.split(path.sep);

	// set i as the count of parts
	let i = parts.length;

	// set dirs as empty array
	const dirs = [];

	// while i >= 0
	while (i > 0) {
		// if parts i is node_modules
		if (parts[i] === 'node_modules') {
			// continue
			continue;
		}

		// push joined paths of parts 0 through i and node_modules to dirs
		dirs.push(
			path.join(...parts.slice(0, i), 'node_modules')
		);

		// set i as i minus 1
		--i;
	}

	// return dirs
	return dirs;
}

function load_index(id) {
	// resolve if id/index.css is a file
	return is_file(path.join(id, 'index.css'));
}

function is_file(id) {
	return fse.lstat(id).then(
		(stat) => stat.isFile() ? Promise.resolve(id) : Promise.reject()
	);
}
