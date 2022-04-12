/**
 * MIT License
 * Copyright (c) 2022 Battledash-2
 * 
 * The easy way to make command line arguments.
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 * File: lib/main.js
 * Desc: Main
 */
// Imports
const clrs = require('terminalcolors.js');
const hideBin = require('./util/hidebin.js');
const Reader = require('./util/reader.js');

const isTrue = (o)=>o === 'on' || o === 'true' || parseInt(o) > 0;
module.exports['isTrue'] = isTrue;
// const doesMatch = (b,o)=>(b === '-'+o || b === '--'+o ||
// 					  b === o || b === o[0] ||
// 					  b === '-'+o[0] || b === '--'+o[0]);
const doesMatch = (b,o)=>(b === '--'+o || b === o || b === o[0] || b === '-'+o[0]);

// Advanced
module.exports['read'] = (args=hideBin(process.argv)) => {
	return new Reader({
		type: 'none', // bool (on/off), none (on), string (...), number (...), any (string/number) 
		name: 'option_'+Reader.RIDX,
		default: [],
		description: 'not implemented',
		aliases: [],
		arguments: 1
	}, list => {
		let obj = {};
		for (let i = 0; i<args.length+1; i++) {
			let clo = args[i++];
			list.iterate(opt => {
				// TODO: Make this :)
				if (typeof obj[opt.name] === 'undefined') obj[opt.name] = {
					name: opt.name,
					value: opt.default,
					arguments: 0
				};
				if (!doesMatch(clo, opt.name)) {
					let stop = true;
					for (let alias of opt.aliases) {
						if (doesMatch(clo, alias)) {
							stop = false;
							break;
						}
					}
					if (stop) return false;
				}
				let o = {
					name: opt.name,
					value: opt.default,
					arguments: 0,
				};
				if (opt.type.toLowerCase() === 'none') {
					o.value = [true];
				} else {
					let nexts = [];
					for (let p = 0; p<opt.arguments; p++) {
						let next = args[i++];
						if (next.startsWith('-') || next == undefined) {
							i--;
							break;
						}
						switch (opt.type.toLowerCase()) { // bool (on/off), none (on), string (...), number (...), any (string/number)
							case 'boolean':
							case 'bool':
								if (next === 'on' || next === 'true' || parseInt(next) > 0) nexts.push(true);
								else nexts.push(false);
								break;
							case 'string':
							case 'str':
								nexts.push(next);
								break;
							case 'number':
							case 'num':
								nexts.push(parseFloat(next));
								break;
							case 'list':
							case 'array':
							case 'arr':
								let sep = opt.seperator || ',';
								nexts.push(next.split(sep));
								break;
							case 'any':
								if (/[^\d\.]/g.test(next)) nexts.push(next);
								else nexts.push(parseFloat(next));
								break;
						}
					}
					o.value = nexts;
					o.arguments = nexts.length;
				}
				obj[opt.name] = o;
			});
		}
		return obj;
	});
}

// Basic
module.exports['hideBin'] = hideBin; // hide binaries (`node . hi` becomes `hi`)
module.exports['parse'] = (args=hideBin(process.argv)) => { // `["53", "hi"]` becomes `[53, "hi"]`
	let out = [];
	for (let i of args) {
		if (/[^\d\.]/g.test(i)) out.push(i);
		else out.push(parseFloat(i));
	}
	return out;
}