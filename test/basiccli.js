const cargv = require('../');

const options = cargv.read(false)
	.add({
		name: 'cool',
		type: 'bool',
		aliases: ['cargv_is_cool'],
		default: [false],
		description: 'Is CArgV cool?'
	}).done();
console.log(options);