const ListConstructor = require("./listConstructor");

module.exports = class Reader extends ListConstructor {
	#cb;

	constructor(def, cb=(_=Reader.BLANK)=>{}) {
		super(def, false);
		this.#cb = cb;
	}
	done() {
		let r = this.#cb(this);
		this.paused = true;
		return r;
	}
}