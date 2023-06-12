import Product from "@/models/Product";
import mongoose from "mongoose";

let cachedProducts: any = null; // Create cached connection variable
let cachedGender: string;

export async function getAllCachedProducts(gender: string) {
    if (cachedProducts && gender === cachedGender) {
        console.log("using cached DB Products");
        return cachedProducts; // Prefer cached connection
    }
    // if not cached
    const productList = await Product.aggregate([{ $sample: { size: 1000 } }]);
    const filtered = productList.filter((x: any) => x.gender === gender);
    console.log("using new DB Products");
    cachedProducts = filtered;
    return filtered;
}
