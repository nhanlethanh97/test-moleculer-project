const ApiGateway = require("moleculer-web");

const DbMixin = require("../mixins/db.mixin");
const Sequelize = require("sequelize");

module.exports = {
	name: "board",
	// version: 1

	/**
	 * Mixins
	 */
	mixins: [DbMixin("board")],
	model: {
		name: "board",
		define: {
			name: Sequelize.STRING,
			userId: Sequelize.INTEGER,
			// views: Sequelize.ARRAY(Sequelize.INTEGER),
			// cells: Sequelize.ARRAY(Sequelize.INTEGER),
		},
		options: {
			// Options from http://docs.sequelizejs.com/manual/tutorial/models-definition.html
		},
	},
	settings: {
		routes: [],
		// fields: ["userId"],
	},

	/**
	 * Action Hooks
	 */
	hooks: {
		before: {
			/**
			 * Register a before hook for the `create` action.
			 * It sets a default value for the quantity field.
			 *
			 * @param {Context} ctx
			 */
			create(ctx) {
				ctx.params.quantity = 0;
			},
			getListByUser(ctx) {
				return 0;
			},
		},
	},
	/**
	 * Actions
	 */
	actions: {
		/**
		 * The "moleculer-db" mixin registers the following actions:
		 *  - list
		 *  - find
		 *  - count
		 *  - create
		 *  - insert
		 *  - update
		 *  - remove
		 */
		getByUser: {
			rest: "GET /list",
			async handler(ctx) {
				const userId = ctx.meta.user.id;
				console.log("🚀 ~ handler ~ userId:", userId);
				const boards = await this.adapter.find({
					query: {
						userId,
					},
				});
				const json = await this.transformDocuments(
					ctx,
					ctx.params,
					boards
				);
				return json;
			},
		},
	},

	/**
	 * Methods
	 */
	methods: {
		/**
		 * Loading sample data to the collection.
		 * It is called in the DB.mixin after the database
		 * connection establishing & the collection is empty.
		 */
		async authenticate(ctx, route, req) {
			console.log("🚀 ~ authenticate ~ ctx:", ctx);
		},
		async seedDB() {
			await this.adapter.insertMany([{ name: "Board 1", userId: 1 }]);
		},
	},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected() {
		// await this.adapter.collection.createIndex({ name: 1 });
	},
};
