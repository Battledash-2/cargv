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

const CallbackReader = require('./util/callbackReader.js');
const Reader = require('./util/reader.js');

const MAX_DESC_DISP_LEN = 250;

const isTrue = (o)=>o === 'on' || o === 'true' || parseInt(o) > 0;
module.exports['isTrue'] = isTrue;
// const doesMatch = (b,o)=>(b === '-'+o || b === '--'+o ||
// 					  b === o || b === o[0] ||
// 					  b === '-'+o[0] || b === '--'+o[0]);
const doesMatch = (b,o)=>(b === '--'+o || b === o || b === o[0]
							|| b === '-'+o[0] || o.slice(0,b.length) === b
							|| o.slice(0, b.replace('-', '').length) === b.replace('-', ''));

const appendTab = (str, tabs=1)=>str.split('\n').map(c=>'\t'.repeat(tabs)+c).join('\n');

const getReaderFor = (mode, ...o) => {
	if (mode === 'callback') return new CallbackReader(...o);
	return new Reader(...o);
}

// Advanced
const read = (args=hideBin(process.argv), helpCommand=true, mode='normal') => {
	if (typeof args === 'boolean') {
		helpCommand = args;
		args = hideBin(process.argv);
	}
	return getReaderFor(mode, {
		type: 'none', // bool (on/off), none (on), string (...), number (...), any (string/number) 
		name: 'option_'+Reader.RIDX,
		default: [],
		description: 'no description',
		usage: null,
		aliases: [],
		arguments: 1
	}, list => {
		let obj;
		if (mode !== 'callback') obj = {};
		for (let i = 0; i<args.length+1;) {
			let clo = args[i++];
			if (clo == undefined) {
				if (mode !== 'callback') {
					return obj;
					// list.iterate(opt=>{
					// 	obj[opt.name] = {
					// 		name: opt.name,
					// 		value: opt.default,
					// 		arguments: 0
					// 	}
					// });
				}
				return;
			}
			if (helpCommand && doesMatch(clo, 'help')) {
				let next = args[i];

				const writeln = (...s)=>console.log(...s);
				const writehelp = (l)=>{
					writeln(clrs.hex('#333', '--------------------------'));
					writeln(clrs.bold(clrs.green('HELP')) + (typeof l !== 'undefined' ? (clrs.hex('#333', ': ') + clrs.blue(l)) : ''));
					writeln(clrs.hex('#333', '--------------------------'));
				}
				
				if (next == undefined) {
					writehelp();
					writeln(clrs.italic('Arguments:'));
					list.iterate(opt=>{
						writeln('\t'+clrs.blue(opt.name)+clrs.hex('#f9f9f9', ': ')+clrs.yellow(opt.description.slice(0, MAX_DESC_DISP_LEN).replace(/[\n\t]/g, " ")) + ' ' + clrs.hex('#444', '(')+clrs.magenta(typeof opt.type === 'object' ? opt.type.join(clrs.hex('#555', '>')) : opt.type)+clrs.hex('#444', ')'));
					});
				} else {
					let option;
					list.iterate(opt=>{
						if (doesMatch(next, opt.name.toLowerCase())) option = opt;
						else for (let alias of opt.aliases) if (doesMatch(next, alias.toLowerCase())) option = opt;
					});
					if (option == undefined) {
						writehelp()
						writeln(clrs.red('Could not find argument ')+clrs.yellow(clrs.bold(next)));
						process.exit(1);
					}
					writehelp(option.name);

					writeln('\u001b[0m'+clrs.italic('Description:'));
					writeln(clrs.hex('#f6f6f6', appendTab(option.description)));
					writeln(clrs.italic('Information:'));
					writeln('\t'+clrs.italic('Type: ')+clrs.magenta(typeof option.type === 'object' ? option.type.join(clrs.hex('#555', '>')) : option.type));
					writeln('\t'+clrs.italic('Arguments: ')+clrs.red(option.arguments.toString()));
					if (option.usage != null) {
						writeln(clrs.hex('#f6f6f6', appendTab(option.usage)));
					} else {
						let usage = clrs.bold(clrs.green('--'+option.name));
						for (let i = 0; i<option.arguments; i++) {
							let type = (typeof option.type === 'object') ? option.type[i]||option.type[option.type.length-1] : option.type;
							usage += ' ';
							const spl = clrs.hex('#555', '|');
							switch (type.toLowerCase()) { // bool (on/off), none (on), string (...), number (...), any (string/number)
								case 'boolean': case 'bool':
									usage += clrs.bold(clrs.hex('#555', '[')) + clrs.blue('on')+spl+clrs.red('off') + clrs.bold(clrs.hex('#555', ']')); break;
								case 'string': case 'str':
									usage += clrs.bold(clrs.hex('#555', '<')) + clrs.blue('string') + clrs.bold(clrs.hex('#555', '>')); break;
								case 'number': case 'num':
									usage += clrs.bold(clrs.hex('#555', '<')) + clrs.blue('number') + clrs.bold(clrs.hex('#555', '>')); break;
								case 'list': case 'array': case 'arr':
									// usage += clrs.bold(clrs.hex('#555', '[')) + clrs.hex('#555', '...') + clrs.blue('any')+clrs.hex('#555', (option.seperator||',')+'...')+clrs.blue('any') + clrs.bold(clrs.hex('#555', ']')); break;
									usage += clrs.bold(clrs.hex('#555', '[')) + clrs.hex('#555', '...') + clrs.blue('list')+clrs.hex('#555', ': '+(option.seperator||',')) + clrs.bold(clrs.hex('#555', ']')); break;
								case 'any':
									usage += clrs.bold(clrs.hex('#555', '<')) + clrs.blue('any') + clrs.bold(clrs.hex('#555', '>')); break;
							}
						}
						writeln('\t'+clrs.italic('Usage: ')+usage);
					}
					writeln('\t'+clrs.italic('Aliases: ')+clrs.magenta(option.aliases.length > 0 ? option.aliases.join(clrs.hex('#555', '>')) : 'no aliases...'));
				}

				process.exit(0);
			}
			list.reiterate(opt => {
				if (mode !== 'callback' && typeof obj[opt.name] === 'undefined' && opt.mode !== 'array') obj[opt.name] = {
					name: opt.name,
					value: opt.default,
					arguments: 0
				}
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
				let o;
				if (mode !== 'callback') o = {
					name: opt.name,
					value: opt.default,
					arguments: 0,
				};
				let type = (typeof opt.type === 'object') ? opt.type[0] : opt.type;
				if (type.toLowerCase() === 'none') {
					if (mode === 'callback') opt.callback(true);
					else o.value = [true];
				} else {
					let nexts = [...opt.default];
					for (let p = 0; p<opt.arguments; p++) {
						let type = (typeof opt.type === 'object') ? opt.type[p]||opt.type[option.type.length-1] : opt.type;
						let next = args[i++];

						if (next == undefined || next.startsWith('-')) {
							i--;
							break;
						}
						switch (type.toLowerCase()) { // bool (on/off), none (on), string (...), number (...), any (string/number)
							case 'boolean':
							case 'bool':
								if (next.toLowerCase() === 'on' || next.toLowerCase() === 'true' || parseInt(next) > 0) nexts[p] = true;
								else nexts[p] = false;
								break;
							case 'string':
							case 'str':
								nexts[p] = next;
								break;
							case 'number':
							case 'num':
								nexts[p] = parseFloat(next);
								break;
							case 'list':
							case 'array':
							case 'arr':
								let sep = opt.seperator || ',';
								// nexts.push(next.split(sep));
								nexts[p] = next.split(sep);
								break;
							case 'any':
								if (/[^\d\.]/g.test(next)) nexts[p] = next;
								else nexts[p] = parseFloat(next);
								break;
						}
					}
					if (mode === 'callback') {
						opt.callback(nexts);
					} else {
						o.value = nexts;
						o.arguments = nexts.length;
					}
				}
				if (opt.mode === 'array') opt.array.push(o);
				else if (mode !== 'callback') obj[opt.name] = o;
			});
		}
		if (mode !== 'callback') return obj;
	});
}
module.exports['read'] = read;
module.exports['cb_read'] = (args=hideBin(process.argv), helpCommand=true) => {
	return read(args, helpCommand, 'callback');
}
module.exports['simple_read'] = (args=hideBin(process.argv)) => {
	const stripDash = (str)=>str.replace(/^-*/g, '');

	let out = {};
	for (let i = 0; i<args.length; i++) {
		let arg = args[i]||'';
		if (arg.includes('=')) {
			out[stripDash(arg.split('=')[0])] = arg.split('=')[1];
		} else {
			if (!args[i+1].startsWith('-')) {
				out[stripDash(arg)] = args[++i];
			} else {
				out[stripDash(arg)] = null;
			}
		}
	}
	return out;
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