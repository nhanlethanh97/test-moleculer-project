"use strict";

const { Cachers } = require("moleculer");

const BaseCacher = require("moleculer").Cachers.Base;

class MyCacher extends BaseCacher {
	async get(key) {
		return await this.get(key);
	}
	async set(key, data, ttl) {
		return await this.set(key, data, ttl);
	}
	async del(key) {
		return await this.del(key);
	}
	async clean(match = "**") {
		return await this.clean(match);
	}
}

module.exports = {
	name: "cacher",
	// version: 1
	cacher: {
        type: "Redis",
    }
};
