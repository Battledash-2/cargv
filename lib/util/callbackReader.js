/**
 * MIT License
 * Copyright (c) 2022 Battledash-2
 * 
 * The easy way to make command line arguments.
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 * File: lib/util/callbackReader.js
 * Desc: Reader
 */
const Reader = require("./reader.js");

module.exports = class CallbackReader extends Reader {
	add(o,c) {
		o.callback = c;
		return super.add(o);
	}
}