import User from "./models/User.js";
import Product from "./models/Product.js";
import { buildSeedProducts, buildSeedUsers } from "./store.js";
export async function seedDatabase() {
  const [userCount, productCount] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
  ]);
  if (userCount === 0) {
    await User.insertMany(buildSeedUsers());
  }
  if (productCount === 0) {
    await Product.insertMany(buildSeedProducts());
  }
}
const __keep = [seedDatabase];
void __keep;
