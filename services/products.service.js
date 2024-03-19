"use strict";

const DbMixin = require("../mixins/db.mixin");
const Sequelize = require("sequelize");
const { default: ApiGatewayService } = require("moleculer-web");
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */
module.exports = {
	name: "products",
	// version: 1

	/**
	 * Mixins
	 */
	mixins: [DbMixin("products")],
	model: {
		name: "products",
		define: {
			name: Sequelize.STRING,
			quantity: Sequelize.INTEGER,
			price: Sequelize.INTEGER,
		},
		options: {
			// Options from http://docs.sequelizejs.com/manual/tutorial/models-definition.html
		},
	},
	/**
	 * Settings
	 */
	settings: {
		// Available fields in the responses
		fields: ["_id", "name", "quantity", "price"],
		// Validator for the `create` & `insert` actions.
		entityValidator: {
			name: "string|min:3",
			price: "number|positive",
		},
		routes: [
			{
				// Enable authentication
				authentication: true,
			},
		],
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
			listProduct(ctx) {
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
		listProduct: {
			rest: "GET /list",
			async handler(ctx) {
				const products = await this.broker.cacher.get("products");
				if (products) {
					return products;
				}
				const res = await this.adapter.find();
				await this.broker.cacher.set("products", res);
				const json = await this.transformDocuments(
					ctx,
					ctx.params,
					res
				);
				return json;
			},
		},

		// --- ADDITIONAL ACTIONS ---

		/**
		 * Increase the quantity of the product item.
		 */

		increaseQuantity: {
			rest: "PUT /:id/quantity/increase",
			params: {
				id: "string",
				value: "number|integer|positive",
			},

			async handler(ctx) {
				const doc = await this.adapter.updateById(ctx.params.id, {
					$inc: { quantity: ctx.params.value },
				});
				const json = await this.transformDocuments(
					ctx,
					ctx.params,
					doc
				);
				await this.entityChanged("updated", json, ctx);

				return json;
			},
		},

		/**
		 * Decrease the quantity of the product item.
		 */
		decreaseQuantity: {
			rest: "PUT /:id/quantity/decrease",
			params: {
				id: "string",
				value: "number|integer|positive",
			},
			/** @param {Context} ctx  */
			async handler(ctx) {
				const doc = await this.adapter.updateById(ctx.params.id, {
					$inc: { quantity: -ctx.params.value },
				});
				const json = await this.transformDocuments(
					ctx,
					ctx.params,
					doc
				);
				await this.entityChanged("updated", json, ctx);
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
		async seedDB() {
			await this.adapter.insertMany([
				{ name: "Samsung Galaxy S10 Plus", quantity: 10, price: 704 },
				{ name: "iPhone 11 Pro", quantity: 25, price: 999 },
				{ name: "Huawei P30 Pro", quantity: 15, price: 679 },
			]);
		},
		async authenticate(ctx, route, req) {
			// Read the token from header
			const auth = req.headers["authorization"];
			console.log("🚀 ~ authenticate ~ auth:", auth);

			if (auth && auth.startsWith("Bearer")) {
				const token = auth.slice(7);

				// Check the token. Tip: call a service which verify the token. E.g. `accounts.resolveToken`
				if (token == "123456") {
					// Returns the resolved user. It will be set to the `ctx.meta.user`
					return { id: 1, name: "John Doe" };
				} else {
					// Invalid token
					throw new ApiGatewayService.Errors.UnAuthorizedError(
						ApiGatewayService.Errors.ERR_INVALID_TOKEN
					);
				}
			} else {
				// No token. Throw an error or do nothing if anonymous access is allowed.
				// throw new E.UnAuthorizedError(E.ERR_NO_TOKEN);
				return null;
			}
		},
	},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected() {
		// await this.adapter.collection.createIndex({ name: 1 });
	},
};
