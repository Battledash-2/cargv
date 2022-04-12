const lib = require('../');

// hidebin test
// console.log(lib.hideBin(process.argv)); // works!
// parse test
// console.log(lib.parse()); // works!

// read test
const options = lib.read()
	.add({
		type: 'list',
		name: 'test',
	}).done();
console.log(options.test);