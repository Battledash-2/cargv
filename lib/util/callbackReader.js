const Reader = require("./reader.js");

/**
 * MIT License
 * Copyright (c) 2022 Battledash-2
 * 
 * The easy way to make command line arguments.
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 * File: lib/util/callbackReader.js
 * Desc: Reader
 */
module.exports = class CallbackReader extends Reader {
	add(o,c) {
		o.callback = c;
		return super.add(o);
	}
}