import nextConnect from "next-connect";
//@ts-ignore
import multer from "multer";
import csv from "csvtojson";
import { ConnectOpenAi } from "@/utils/openaiUtils";
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
        console.log("file read...")
        const currentSizeGuide = SizeGuidesByBrand.filter((x: any) => x.brand_name === "SOLBARI Sun Protection")[0];
        const womenSG = currentSizeGuide.women_top;
        docs.forEach(async function (item: any, key: number) {
            womenSG.forEach(async (x: any) => {
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
                const productName = item.product_name + " - " + x.size_name;
                const isWomen = item.product_name.includes("Women") || item.product_name.includes("Women's") ? true : false;
                const price = item.search_price;
                const today = new Date();
                const idObject = {
                    key: "aw_product_id",
                    value: item.aw_product_id
                }
                const color = item.colour;
                console.log("brand: " + item.brand_name);
                const currentSizeGuide = SizeGuidesByBrand.filter((x) => x.brand_name === item.brand_name)[0];
                console.log("size guide:" + currentSizeGuide);
                const currentSize = x;
                console.log("current size:" + currentSize);
                const currentCategory = getGarmentCategory(productName);
                if (currentSize && currentCategory !== "n/a") {
                    const query = { product_name: productName };
                    const existingProduct = await Product.findOne(query).lean();
                    if (!existingProduct) {
                        const response = await Product.create({
                            brand_name: item.brand_name,
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
                        });
                    }
                }
            })
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
