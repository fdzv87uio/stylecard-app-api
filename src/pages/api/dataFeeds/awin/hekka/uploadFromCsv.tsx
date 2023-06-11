import nextConnect from "next-connect";
//@ts-ignore
import multer from "multer";
import csv from "csvtojson";
import { getGarmentCategory } from "@/utils/formatters";
import Product from "@/models/Product";
import { connectMongoose } from "@/utils/connectMongoose";
import { runMiddleware } from "@/utils/corsUtil";
import { SizeGuidesByBrand } from "@/constants/SizeGuidesByBrand";
import { unlinkSync } from "fs";

const upload = multer({
    storage: multer.diskStorage({
        destination: "./public/uploads",
        filename: (req: any, file: any, cb: any) => cb(null, file.originalname),
    }),
});

const apiRoute = nextConnect({
    onError(error, req: any, res: any) {
        res
            .status(501)
            .json({ error: `Sorry something Happened! ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

apiRoute.use(upload.single("uploaded_file"));

apiRoute.post(async (req, res) => {
    try {
        await runMiddleware(req, res);
        await connectMongoose().catch((error: any) => res.json(error.message));
        const { file_name } = req.body;
        const filepath = "./public/uploads/" + file_name;
        console.log("reading csv file...")
        const docs = await csv().fromFile(filepath);
        console.log("file read...");
        let errorCount = 0;
        let docLen = docs.length;
        let newProducts: any[] = [];
        const currentProducts = await Product.find();
        docs.forEach(async function (item: any, key: number) {
            let currentImageArray = [];
            if (item.merchant_image_url) {
                currentImageArray.push(item.merchant_image_url);
            }
            if (item.alternate_image) {
                currentImageArray.push(item.alternate_image);
            }
            if (item.alternate_image_two) {
                currentImageArray.push(item.alternate_image_two);
            }
            console.log("images:" + currentImageArray);
            const productName = item.product_name;
            const productNameArray1 = productName.split(" ");
            console.log("PDM:" + productNameArray1);
            const isWomen = true;
            const price = item.search_price;
            const today = new Date();
            const idObject = {
                key: "aw_product_id",
                value: item.aw_product_id
            }
            const size = item.custom_4.toUpperCase();
            console.log("size:" + size);
            const color = item.colour ? item.colour : "n/a";
            const currentSizeGuide = SizeGuidesByBrand.filter((x) => x.brand_name === item.custom_1)[0];
            console.log("size guide:" + currentSizeGuide);
            const currentSizeArray = isWomen ? currentSizeGuide.women_top : currentSizeGuide.men_top;
            const currentSize = currentSizeArray.filter((x) => x.size_name === size)[0];
            console.log("current size:" + currentSize);
            const currentCategory = getGarmentCategory(productName);
            const existingProduct = currentProducts.filter((x: any) => x.product_name === productName)[0];
            if (currentSize && currentCategory !== "n/a" && !existingProduct) {
                const newProduct: any = {
                    brand_name: item.custom_1,
                    product_name: item.product_name,
                    description: item.description,
                    gender: isWomen ? "women" : "men",
                    deep_url: item.aw_deep_link,
                    product_url: item.merchant_deep_link,
                    images: currentImageArray,
                    color: color,
                    product_id: idObject,
                    category: currentCategory,
                    size: currentSize,
                    price: price,
                    date_pulled: today.toLocaleDateString(),
                };
                newProducts.push(newProduct);
            } else {
                errorCount = errorCount + 1;
            }
        });

        if (newProducts.length > 0) {
            await Product.create(newProducts);
            unlinkSync(filepath);
            console.log("file erased");
            res.status(200).json({ status: "Update Complete", lines_processed: docLen, update_count: newProducts.length, error_count: errorCount, });
        } else {
            res.status(403).json({ status: "Update Failed", lines_processed: docLen, update_count: newProducts.length, error_count: errorCount, });
        }

    } catch (error: any) {
        res.status(409).json({ status: "error", message: error.message });
    }
});

export default apiRoute;

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};
