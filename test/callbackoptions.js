const cargv = require('../');

cargv.cb_read()
	.add({
		name: 'test',
		type: 'list'
	}, (a)=>{
		console.log(a);
	}).done();