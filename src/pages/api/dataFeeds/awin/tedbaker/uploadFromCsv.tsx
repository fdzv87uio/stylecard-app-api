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
            const isWomen = item["Fashion:suitable_for"] === "Female" ? true : false;
            let sizeString = item["Fashion:size"] ? item["Fashion:size"] : "n/a";
            sizeString = sizeString.replaceAll("(", "|");
            sizeString = sizeString.replaceAll(")", "|");
            const sizeArray = sizeString.split("|");
            const size = sizeArray[1];
            const color = item.colour;
            const productName = item.product_name + " - " + size;
            const price = item.search_price;
            const today = new Date();
            const idObject = {
                key: "aw_product_id",
                value: item.aw_product_id
            }
            console.log("size:" + size);

            const currentSizeGuide = SizeGuidesByBrand.filter((x) => x.brand_name === item.brand_name)[0];
            console.log("size guide:" + currentSizeGuide);
            const currentSizeArray = isWomen ? currentSizeGuide.women_top : currentSizeGuide.men_top;
            const currentSize = currentSizeArray.filter((x) => x.size_name === size)[0];
            console.log("current size:" + currentSize);
            const currentCategory = getGarmentCategory(item.product_name);
            console.log("BN:" + item.brand_name);
            if (currentSize && currentCategory !== "n/a") {
                const query = { product_name: productName };
                const existingProduct = await Product.findOne(query).lean();
                if (!existingProduct) {
                    const response = await Product.create({
                        brand_name: item.brand_name,
                        product_name: productName,
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
                    });

                }
            }
        });
        unlinkSync(filepath);
        console.log("file erased");
        res.status(200).json({ status: "success" });
    } catch (error: any) {
        res.status(409).json({ error: error.message });
    }
});

export default apiRoute;

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};


