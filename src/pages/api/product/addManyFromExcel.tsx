import nextConnect from "next-connect";
//@ts-ignore
import multer from "multer";
import Product from "@/models/Product";
import { connectMongoose } from "@/utils/connectMongoose";
import { runMiddleware } from "@/utils/corsUtil";
import { SizeGuidesByBrand } from "@/constants/SizeGuidesByBrand";
import { unlinkSync } from "fs";
import * as XLSX from "xlsx";
import csv from "csvtojson";
import { getGarmentCategory } from "@/utils/formatters";

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
        console.log("reading excel file...")
        const workbook = XLSX.readFile(filepath);
        const worksheet = workbook.Sheets.product_data;
        const csvFile = XLSX.utils.sheet_to_csv(worksheet);
        const docs = await csv().fromString(csvFile);
        let newProductArray: any = [];
        let oldProductArray: any = [];
        let docsLen = 0;
        let docsProcessed = 0;
        docs.forEach((x: any) => {
            if (x.product_name !== "") {
                docsLen = docsLen + 1;
            }
        })
        docs.forEach(async function (item: any, key: number) {
            if (item.product_name !== "") {
                let today = new Date().toLocaleDateString('en-US');
                let currentImageArray = [item.image_1, item.image_2, item.image_3];
                console.log("images:" + currentImageArray);
                const productName = item.product_name;
                const price = item.price;
                const idObject = {
                    key: "product_id",
                    value: item.product_id
                }
                const currentSizeGuide = SizeGuidesByBrand.filter((x) => x.brand_name === item.brand_name)[0];
                console.log("size guide:" + currentSizeGuide);
                const color = item.color;
                const currentSizeArray = item.gender === "women" ? currentSizeGuide.women_top : currentSizeGuide.men_top;
                const currentSize = currentSizeArray.filter((x) => x.size_name === item.size)[0];
                console.log("current size:" + currentSize);
                const currentCategory = item.category;
                if (currentSize && currentCategory) {
                    const query = { product_name: productName };
                    const existingProduct = await Product.findOne(query).lean();
                    if (!existingProduct) {
                        const newProduct = {
                            brand_name: item.brand_name,
                            product_name: item.product_name,
                            description: item.description,
                            gender: item.gender,
                            deep_url: item.deep_url,
                            product_url: item.product_url,
                            images: currentImageArray,
                            color: color,
                            product_id: idObject,
                            category: currentCategory,
                            size: currentSize,
                            price: price,
                            date_pulled: today,
                        }
                        const response = await Product.create(newProduct);
                        newProductArray.push(newProduct);
                        docsProcessed = docsProcessed + 1;
                    } else if (existingProduct && existingProduct.date_pulled !== today && existingProduct.size.size_name !== currentSize.size_name) {
                        const newProduct = {
                            brand_name: item.brand_name,
                            product_name: item.product_name,
                            description: item.description,
                            gender: item.gender,
                            deep_url: item.deep_url,
                            product_url: item.product_url,
                            images: currentImageArray,
                            color: color,
                            product_id: idObject,
                            category: currentCategory,
                            size: currentSize,
                            price: price,
                            date_pulled: today,
                        }
                        const response = await Product.create(newProduct);
                        newProductArray.push(newProduct);
                        docsProcessed = docsProcessed + 1;
                    } else if (existingProduct && existingProduct.date_pulled === today && existingProduct.size.size_name !== currentSize.size_name) {
                        const newProduct = {
                            brand_name: item.brand_name,
                            product_name: item.product_name,
                            description: item.description,
                            gender: item.gender,
                            deep_url: item.deep_url,
                            product_url: item.product_url,
                            images: currentImageArray,
                            color: color,
                            product_id: idObject,
                            category: currentCategory,
                            size: currentSize,
                            price: price,
                            date_pulled: today,
                        }
                        const response = await Product.create(newProduct);
                        newProductArray.push(newProduct);
                        docsProcessed = docsProcessed + 1;
                    } else {
                        const newProduct = {
                            brand_name: item.brand_name,
                            product_name: item.product_name,
                            description: item.description,
                            gender: item.gender,
                            deep_url: item.deep_url,
                            product_url: item.product_url,
                            images: currentImageArray,
                            color: color,
                            product_id: idObject,
                            category: currentCategory,
                            size: currentSize,
                            price: price,
                            date_pulled: item.date_pulled,
                        }
                        oldProductArray.push(newProduct.product_name);
                        docsProcessed = docsProcessed + 1;
                    }
                    if (docsLen === docsProcessed) {
                        res.status(200).json({ status: "update operation complete", update_count: newProductArray.length, repeated: oldProductArray });
                    }
                }
            }
        });


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
