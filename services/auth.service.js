const { default: ApiGatewayService } = require("moleculer-web");
const DbMixin = require("../mixins/db.mixin");
const Sequelize = require("sequelize");

module.exports = {
	name: "auth",

	/**
	 * Settings
	 */
	settings: {},
	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		login: {
			rest: "POST /login",
			async handler(ctx) {
				const { email, password } = ctx.params;
				const user = await ctx.call("user.findByEmail", { email });
				if (!user) {
					ctx.meta.$statusMessage = "User not found";
					ctx.meta.$statusCode = 400;
					return {
						data: null,
					};
				}
				if (user.password !== password) {
					ctx.meta.$statusMessage = "Wrong email or password";
					ctx.meta.$statusCode = 400;
					return {
						data: null,
					};
				}
				const token = "user-" + user.id;
				await this.broker.cacher.set(token, user);
				delete user.dataValues.password;
				return {
					user,
					token,
				};
			},
		},
	},

	/**
	 * Events
	 */
	events: {},

	/**
	 * Methods
	 */
	methods: {},

	/**
	 * Service created lifecycle event handler
	 */
	created() {},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {},

	/**
	 * Service stopped lifecycle event handler
	 */
};
