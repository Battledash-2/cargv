module.exports = class ListConstructor {
	static RIDX = '\x00p';

	constructor(def={}, paused=false) {
		this.list = [];
		this.default = def;
		this.position = 0;
		this.idx = 0;
		this.paused = paused;
	}
	reachedEnd() {
		return this.position >= this.list.length;
	}
	add(...ops) {
		for (let opt of ops) {
			if (this.paused) return;
			this.idx++;
			let def = this.default;
			for (let p in def) {
				if (typeof def[p] !== 'string') continue;
				if (def === this.default && typeof opt[p] === 'undefined' && def[p].includes(ListConstructor.RIDX)) {
					def = {...this.default};
					def[p] = def[p].replace(ListConstructor.RIDX, this.idx);
				}
			}
			let o = {...def, ...opt};
			this.list.push(o);
		}
		return this;
	}
	next() {
		return this.list[this.position++];
	}
	iterate(cb) {
		if (this.paused) return;
		// for (;this.position<this.list.length; this.position++) {
		while (!this.reachedEnd()) {
			if (this.paused) continue;
			const c = this.next();
			if (cb(c) === true) break;
		}
	}

	static BLANK = new this({},true);
}