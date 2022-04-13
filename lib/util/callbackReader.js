const ListConstructor = require("./listConstructor.js");

/**
 * MIT License
 * Copyright (c) 2022 Battledash-2
 * 
 * The easy way to make command line arguments.
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 * File: lib/util/callbackReader.js
 * Desc: Reader
 */
module.exports = class CallbackReader extends ListConstructor {
	#cb;

	constructor(def, cb=(_=Reader.BLANK)=>{}) {
		super(def, false);
		this.#cb = cb;
	}
	add(o,c) {
		o.callback = c;
		return super.add(o);
	}
	done() {
		let r = this.#cb(this);
		this.paused = true;
		return r;
	}
}