const cargv = require('../');

const myArr = [];
cargv.read()
	.add({
		mode: 'array',
		array: myArr,
		name: 'eeee',
		type: 'str'
	}).done();

console.log(myArr);