import { connectMongoose } from "@/utils/connectMongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { runMiddleware } from "@/utils/corsUtil";
import Product from "@/models/Product";
import StylePreference from "@/models/StylePreference";
import User from "@/models/User";
import { getZiplineRanking } from "@/utils/ziplineCalculator";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Run the middleware
    await runMiddleware(req, res);
    await connectMongoose().catch((error: any) => res.json(error.message));
    const { product_url, user_id } = req.body;
    if (req.method !== "POST")
        res.status(405).json({ error: "Html Method not allowed" });
    try {
        console.log("Fetching Product");
        const filterProduct = { product_url: product_url };
        const productResponse: any = await Product.find(filterProduct);
        console.log(productResponse);
        console.log("Fetching User");
        const filterUser = { _id: user_id };
        const userResponse: any = await User.findOne(filterUser);
        console.log("User Fetched");
        console.log("Fetching user Style Preferences ");
        const userStylePreferences = await StylePreference.findOne({ creator_id: user_id });
        console.log("SP Fetched");
        if (productResponse.length === 1) {
            const userMeasurements = {
                chest: userResponse.chest,
                waist: userResponse.waist,
                hip: userResponse.hips,
                unit: userResponse.units,
            };
            const currentZiplineResult = getZiplineRanking(userMeasurements, userStylePreferences, productResponse[0]);
            let resultObject = { item: productResponse, ranking: currentZiplineResult };
            return res.status(200).json({ status: "success", data: resultObject });
        } else if (productResponse.length > 1) {
            let resultArray: any = [];
            productResponse.forEach((item: any) => {
                const userMeasurements = {
                    chest: userResponse.chest,
                    waist: userResponse.waist,
                    hip: userResponse.hips,
                    unit: userResponse.units,
                };
                const currentZiplineResult = getZiplineRanking(userMeasurements, userStylePreferences, item);
                let resultObject = { item: productResponse, ranking: currentZiplineResult };
                resultArray.push(resultObject);
            })
            resultArray.sort(function (a: any, b: any) {
                if (a.ranking.ranking_avg > b.ranking.ranking_avg) {
                    return -1;
                }
                if (a.ranking.ranking_avg < b.ranking.ranking_avg) {
                    return 1;
                }
                // names must be equal
                return 0;
            });
            return res.status(200).json({ status: "success", data: resultArray[0] });
        }
    } catch (error) {
        res.status(409).json({
            error: "An error occurred while creating user: " + error,
        });
    }
}
