/**
 * The easy way to make command line arguments.
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 * File: lib/util/hidebin.js
 * Desc: Hide binaries (`node . --hi` becomes `--hi`)
 */
// "inspired" by yargs :)

const isElectron = () => !!(process.versions && process.versions.electron);
const isBundledElectron = () => isElectron() && !process.defaultApp;

const getOffset = () => {
	// bin ....
	if (isBundledElectron())
		return 1;
	// bin <file> ....
	return 2;
}

module.exports = (args=[]) => {
	return args.slice(getOffset());
}