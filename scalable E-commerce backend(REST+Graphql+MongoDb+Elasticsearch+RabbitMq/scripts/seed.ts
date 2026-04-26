import bcrypt from "bcryptjs";
import { createConnection, Schema } from "mongoose";

const mongoUri = process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017/scalable_ecommerce";

const productSchema = new Schema(
	{
		name: String,
		slug: String,
		description: String,
		price: Number,
		currency: String,
		category: String,
		tags: [String],
		stock: Number,
		active: Boolean
	},
	{ timestamps: true }
);

const inventorySchema = new Schema(
	{
		productId: String,
		sku: String,
		available: Number,
		reserved: Number,
		reorderThreshold: Number
	},
	{ timestamps: true }
);

const userSchema = new Schema(
	{
		name: String,
		email: String,
		passwordHash: String,
		role: String
	},
	{ timestamps: true }
);

const seed = async (): Promise<void> => {
	const catalogConnection = createConnection(mongoUri, { dbName: "catalog_service" });
	const inventoryConnection = createConnection(mongoUri, { dbName: "inventory_service" });
	const userConnection = createConnection(mongoUri, { dbName: "user_service" });

	await Promise.all([catalogConnection.asPromise(), inventoryConnection.asPromise(), userConnection.asPromise()]);

	const Product = catalogConnection.model("Product", productSchema);
	const Inventory = inventoryConnection.model("InventoryItem", inventorySchema);
	const User = userConnection.model("User", userSchema);

	await Promise.all([Product.deleteMany({}), Inventory.deleteMany({}), User.deleteMany({})]);

	const products = await Product.insertMany([
		{
			name: "Studio Headphones",
			slug: "studio-headphones",
			description: "Closed-back headphones for creators and gamers.",
			price: 199.99,
			currency: "USD",
			category: "electronics",
			tags: ["audio", "studio", "featured"],
			stock: 25,
			active: true
		},
		{
			name: "Mechanical Keyboard",
			slug: "mechanical-keyboard",
			description: "Hot-swappable keyboard with tactile switches.",
			price: 129.5,
			currency: "USD",
			category: "electronics",
			tags: ["keyboard", "desk"],
			stock: 40,
			active: true
		},
		{
			name: "Travel Backpack",
			slug: "travel-backpack",
			description: "Weatherproof backpack sized for weekend trips.",
			price: 89,
			currency: "USD",
			category: "lifestyle",
			tags: ["travel", "bags"],
			stock: 18,
			active: true
		},
		{
			name: "Ceramic Mug",
			slug: "ceramic-mug",
			description: "Large matte mug for coffee and tea.",
			price: 18.25,
			currency: "USD",
			category: "home",
			tags: ["kitchen", "mug"],
			stock: 60,
			active: true
		}
	]);

	await Inventory.insertMany(
		products.map((product) => ({
			productId: product._id.toString(),
			sku: product.slug,
			available: product.stock,
			reserved: 0,
			reorderThreshold: 5
		}))
	);

	const passwordHash = await bcrypt.hash("secret123", 10);
	await User.insertMany([
		{
			name: "Store Admin",
			email: "admin@example.com",
			passwordHash,
			role: "admin"
		},
		{
			name: "Ada Shopper",
			email: "ada@example.com",
			passwordHash,
			role: "customer"
		}
	]);

	await Promise.all([catalogConnection.close(), inventoryConnection.close(), userConnection.close()]);
	console.info("Seed data inserted successfully");
};

void seed().catch((error) => {
	console.error("Failed to seed data", error);
	process.exit(1);
});