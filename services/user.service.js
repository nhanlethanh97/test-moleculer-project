const { default: ApiGatewayService } = require("moleculer-web");
const DbMixin = require("../mixins/db.mixin");
const Sequelize = require("sequelize");

module.exports = {
	name: "user",
	// version: 1

	/**
	 * Mixins
	 */
	mixins: [DbMixin("user")],
	model: {
		name: "user",
		define: {
			name: Sequelize.STRING,
			email: Sequelize.STRING,
			password: Sequelize.STRING,
		},
		options: {
			// Options from http://docs.sequelizejs.com/manual/tutorial/models-definition.html
		},
	},
	settings: {
		populates: {},
	},
	actions: {
		getList: {
			rest: "GET /list",
			async handler(ctx) {
				const user = await this.adapter.findById(ctx.params.id);
				const json = await this.transformDocuments(
					ctx,
					ctx.params,
					user
				);
				return json;
			},
		},
		findByEmail: {
			async handler(ctx) {
				const { email } = ctx.params;
				const user = await this.adapter.findOne({
					where: {
						email,
					},
				});
				return user;
			},
		},
	},
	methods: {
		async seedDB() {
			await this.adapter.insertMany([
				{
					name: "User name 1",
					email: "email1@gmail.com",
					password: "123",
				},
			]);
		},
	},
	async afterConnected() {
		// await this.adapter.collection.createIndex({ name: 1 });
	},
};
