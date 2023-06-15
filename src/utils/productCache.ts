import Product from "@/models/Product";
import mongoose from "mongoose";

let cachedProducts: any = null; // Create cached connection variable
let cachedGender: string;

export async function getAllCachedProducts(gender: string) {
    if (cachedProducts && gender === cachedGender) {
        console.log("using cached DB Products");
        return cachedProducts; // Prefer cached connection
    }
    const productList = await Product.aggregate([{ $match: { $or: [{ brand_name: { $eq: "Gant" } }, { brand_name: { $eq: "Dresslily" } }, { brand_name: { $eq: "Joules" } }, { brand_name: { $eq: "Ted Baker" } }, { brand_name: { $eq: "Hello Molly" } }, { brand_name: { $eq: "Sweaty Betty" } }, { gender: { $eq: gender } }] } }, { $sample: { size: 500 } }]);
    console.log("using new DB Products");
    console.log(productList);
    cachedProducts = productList;
    return productList;
}
