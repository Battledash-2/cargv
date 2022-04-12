const cargv = require('../');

const options = cargv.read()
	.add({
		name: 'test',
		type: ['boolean', 'number'],
		default: [true, 5],
		arguments: 2
	}).done();

console.log(options);