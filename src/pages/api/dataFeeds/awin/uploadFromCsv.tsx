import nextConnect from "next-connect";
//@ts-ignore
import multer from "multer";
import csv from "csvtojson";
import { ConnectOpenAi } from "@/utils/openaiUtils";
import { getFormattedGender, getFormattedSize } from "@/utils/formatters";
import { GarmentSizes } from "@/constants/GarmentSizes";
import Product from "@/models/Product";
import { connectMongoose } from "@/utils/connectMongoose";
import { runMiddleware } from "@/utils/corsUtil";

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
    const openAI = await ConnectOpenAi();
    await runMiddleware(req, res);
    await connectMongoose().catch((error: any) => res.json(error.message));
    const { file_name } = req.body;
    const filepath = "./public/uploads/" + file_name;
    const docs = await csv().fromFile(filepath);
    let updateCount = 0;
    docs.forEach(async function (item: any, key: number) {
      const retailerDeepLink = item.aw_deep_link;
      const promptModel = `write a Json object including garment type, gender, material composition, colors available array, sizes available array and prices in USD available of the product on sale on this website: ${retailerDeepLink}, and make sure to not include any notes or comments at the end`;
      const completion = await openAI.createCompletion({
        model: "text-davinci-003",
        prompt: promptModel,
        max_tokens: 236,
        temperature: 0.2,
        n: 1,
      });
      const answer = completion.data.choices[0].text;
      if (answer) {
        var answerObject = JSON.parse(answer);
        var productIDObject = {
          key: "aw_product_id",
          value: item.aw_product_id,
        };
        var today = new Date();
        var sizesArray = answerObject["Sizes Available"];
        var colorArray = answerObject["Colors Available"];
        var currentGender = answerObject["Gender"];
        var currentType = answerObject["Garment Type"];
        var formattedCurrentType = currentType
          ? currentType.toLowerCase()
          : "n/a";
        var currentComposition = answerObject["Material Composition"];
        var formattedGender = getFormattedGender(currentGender);
        var rootUrlArray = item.merchant_deep_link.split("/");
        var rootUrl = rootUrlArray[2];
        let sizeObject: any;
        let sizeObjectArray: any[] = [];

        if (
          sizesArray &&
          typeof sizesArray.length !== "undefined" &&
          sizesArray.length > 0
        ) {
          sizesArray.forEach((item: any) => {
            var trueSize = getFormattedSize(item);
            GarmentSizes.forEach((x: any) => {
              if (x.size_name === trueSize) {
                sizeObject = x;
                sizeObjectArray.push(sizeObject);
              }
            });
          });
        } else {
          var trueSize = getFormattedSize(sizesArray);
          GarmentSizes.forEach((x: any) => {
            if (x.size_name === trueSize) {
              sizeObject = x;
              sizeObjectArray.push(sizeObject);
            }
          });
        }
        const response = await Product.create({
          brand_name: item.brand_name,
          product_name: item.product_name,
          gender: formattedGender,
          base_url: rootUrl,
          product_url: item.aw_deep_link,
          images: [item.merchant_image_url],
          colors: colorArray,
          merchant_price: item.search_price,
          composition: currentComposition,
          product_id: productIDObject,
          fit: "n/a",
          categories: [formattedCurrentType],
          sizes: sizeObjectArray,
          date_pulled: today.toLocaleDateString(),
        });
      }
    });
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
