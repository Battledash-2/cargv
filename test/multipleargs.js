const cargv = require('../');

const options = cargv.read()
	.add({
		name: 'test',
		type: ['boolean', 'number', 'list', 'string'],
		default: [true, 5, ['hello'], 'idk'],
		aliases: ['myalias', 'lolalias'],
		arguments: 4,
		description: 'my profesonal tes descraptin\n\nokk'
	}).done();

console.log(options.test);