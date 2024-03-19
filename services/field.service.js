const ApiGateway = require("moleculer-web");

const DbMixin = require("../mixins/db.mixin");
const Sequelize = require("sequelize");

module.exports = {
	name: "field",
	// version: 1

	/**
	 * Mixins
	 */
	mixins: [DbMixin("field")],
	model: {
		name: "field",
		define: {
			boardId: Sequelize.INTEGER,
			name: Sequelize.STRING,
			position: Sequelize.INTEGER,
			dataType: Sequelize.INTEGER,
			records: [Sequelize.INTEGER],
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
		addField: {
			rest: "POST /add",
			async handler(ctx) {
				const { boardId, name, dataType, position } = ctx.params;
				const board = await ctx.call("board.get", { id: boardId });
				if (!board) {
					throw new Error("Board not found");
				}
				const newField = await ctx.call("field.create", {
					boardId,
					name,
					dataType,
					position,
				});
				return newField;
			},
		},
		updateField: {
			rest: "PUT /update",
			async handler(ctx) {
				const { id, name, dataType, position } = ctx.params;
				const field = await ctx.call("field.get", { id });
				if (!field) {
					throw new Error("Field not found");
				}
				const newField = await ctx.call("record.update", {
					id,
					name,
					dataType,
					position,
				});
				return newField;
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
			// await this.adapter.insertMany([
			// 	{ name: "Board 1",  },
			// ]);
		},
	},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected() {
		// await this.adapter.collection.createIndex({ name: 1 });
	},
};
