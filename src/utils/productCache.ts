import Product from "@/models/Product";
import mongoose from "mongoose";

let cachedProducts: any = null; // Create cached connection variable
let cachedGender: string;

export async function getAllCachedProducts(gender: string) {
    if (cachedProducts && gender === cachedGender) {
        console.log("using cached DB Products");
        return cachedProducts; // Prefer cached connection
    }
    const productList1 = await Product.aggregate([{ $match: { $and: [{ brand_name: { $eq: "Gant" } }, { gender: { $eq: gender } }] } }, { $sample: { size: 100 } }]);
    const productList2 = await Product.aggregate([{ $match: { $and: [{ brand_name: { $eq: "Dresslily" } }, { gender: { $eq: gender } }] } }, { $sample: { size: 100 } }]);
    const productList3 = await Product.aggregate([{ $match: { $and: [{ brand_name: { $eq: "Joules" } }, { gender: { $eq: gender } }] } }, { $sample: { size: 100 } }]);
    const productList4 = await Product.aggregate([{ $match: { $and: [{ brand_name: { $eq: "Ted Baker" } }, { gender: { $eq: gender } }] } }, { $sample: { size: 100 } }]);
    const productList5 = await Product.aggregate([{ $match: { $and: [{ brand_name: { $eq: "Hello Molly" } }, { gender: { $eq: gender } }] } }, { $sample: { size: 100 } }]);
    const productList6 = await Product.aggregate([{ $match: { $and: [{ brand_name: { $eq: "Sweaty Betty" } }, { gender: { $eq: gender } }] } }, { $sample: { size: 100 } }]);
    const productList = productList1.concat(productList2, productList3, productList4, productList5, productList6);
    console.log("using new DB Products");
    console.log(productList);
    cachedProducts = productList;
    return productList;
}
