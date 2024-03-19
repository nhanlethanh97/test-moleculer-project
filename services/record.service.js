const ApiGateway = require("moleculer-web");

const DbMixin = require("../mixins/db.mixin");
const Sequelize = require("sequelize");

module.exports = {
	name: "record",
	// version: 1

	/**
	 * Mixins
	 */
	mixins: [DbMixin("record")],
	model: {
		name: "record",
		define: {
			fieldId: Sequelize.INTEGER, // populate with field
            data: Sequelize.STRING,
			position: Sequelize.INTEGER,
		},
		options: {
			// Options from http://docs.sequelizejs.com/manual/tutorial/models-definition.html
		},
	},
	settings: {
		routes: [
		],
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
		addRecord: {
			rest: "POST /add",
			async handler(ctx) {
				const { fieldId, data, position } = ctx.params;
				const field = await ctx.call("field.get", { id: fieldId });
				if (!field) {
					throw new Error("Field not found");
				}
				const newRecord = await ctx.call("record.create", {
					fieldId,
					data,
					position,
				});
				return newRecord;
			},
		},
		updateRecord: {
			rest: "PUT /update",
			async handler(ctx) {
				const { recordId, data, position } = ctx.params;
				const record = await ctx.call("record.get", { id: recordId });
				if (!record) {
					throw new Error("Record not found");
				}
				const updatedRecord = await ctx.call("record.update", {
					id: recordId,
					data,
					position,
				});
				return updatedRecord;
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
