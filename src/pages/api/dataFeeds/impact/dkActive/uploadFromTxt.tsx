import nextConnect from "next-connect";
//@ts-ignore
import multer from "multer";
import { getGarmentCategory, tsvJSON } from "@/utils/formatters";
import Product from "@/models/Product";
import { connectMongoose } from "@/utils/connectMongoose";
import { runMiddleware } from "@/utils/corsUtil";
import { SizeGuidesByBrand } from "@/constants/SizeGuidesByBrand";
import { unlinkSync } from "fs";
import fsPromises from 'fs/promises';


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
        console.log("Reading txt file...");
        const result = await fsPromises.readFile(filepath);
        const text = result.toString();
        console.log("Converting to Json...");
        const jsonArray = tsvJSON(text);
        jsonArray.forEach(async function (item: any, key: number) {
            let currentImageArray = [];
            if (item['Image URL']) {
                currentImageArray.push(item['Image URL']);
            }
            if (item['Alternative Image URL 2']) {
                currentImageArray.push(item['Alternative Image URL 2']);
            }
            if (item['Alternative Image URL 3']) {
                currentImageArray.push(item['Alternative Image URL 3']);
            }
            console.log("images:" + currentImageArray);
            const productName = item['Product Name'];
            const currentCategory = getGarmentCategory(productName);
            const isWomen = true;
            const price = item["Current Price"];
            const today = new Date();
            const idObject = {
                key: "Unique Merchant SKU",
                value: item["Unique Merchant SKU"]
            }
            const size = item["Size"];
            console.log("size:" + size);
            const color = item["Color"] ? item["Color"] : "n/a";
            const currentSizeGuide = SizeGuidesByBrand.filter((x) => x.brand_name === item["Manufacturer"])[0];
            console.log("size guide:" + currentSizeGuide);
            const currentSizeArray = currentSizeGuide.women_top;
            const currentSize = currentSizeArray.filter((x) => x.size_name === size)[0];
            console.log("current size:" + currentSize);

            if (currentSize && currentCategory !== "n/a") {
                const query = { product_name: productName };
                const existingProduct = await Product.findOne(query).lean();
                if (!existingProduct) {
                    const response = await Product.create({
                        brand_name: item["Manufacturer"],
                        product_name: productName,
                        description: item["Product Description"],
                        gender: "women",
                        deep_url: item["Product URL"],
                        product_url: item["Product URL"],
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
