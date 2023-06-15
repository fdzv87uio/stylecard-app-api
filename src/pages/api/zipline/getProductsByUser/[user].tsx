import { connectMongoose } from "@/utils/connectMongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { runMiddleware } from "@/utils/corsUtil";
import User from "@/models/User";
import Product from "@/models/Product";
import StylePreference from "@/models/StylePreference";
import { getZiplineRanking } from "@/utils/ziplineCalculator";
import { getAllCachedProducts } from "@/utils/productCache";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Run the middleware
  await runMiddleware(req, res);
  await connectMongoose().catch((error: any) => res.json(error.message));
  const { user } = req.query;
  console.log(user);
  console.log("Fetching current user.. ");
  let currentUser = await User.findOne({ _id: user })
  console.log(currentUser);
  if (!currentUser || typeof currentUser === "undefined") {
    res.status(404).json({ error: "User Not Found" });
  }
  if (req.method !== "GET")
    res.status(405).json({ error: "Html Method not allowed" });
  try {
    console.log("Fetching user Style Preferences ");
    const userStylePreferences = await StylePreference.findOne({ creator_id: user });
    console.log(userStylePreferences);
    console.log("Fetching products from MongoDB ");
    const productList = await getAllCachedProducts(currentUser.gender);
    let resultArray: any[] = [];
    let orderedResultArray: any[] = [];
    productList.forEach((item: any, key: number) => {
      const userMeasurements = {
        chest: currentUser.chest,
        waist: currentUser.waist,
        hip: currentUser.hips,
        unit: currentUser.units,
      };
      const currentZiplineResult: any = getZiplineRanking(userMeasurements, userStylePreferences, item);
      let resultObject = { item: item, ranking: currentZiplineResult };
      if (resultObject.ranking.ranking_avg > 0) {
        resultArray.push(resultObject);
      }
      if (key === productList.length - 1) {
        resultArray.sort((a: any, b: any) => {
          if (a.ranking.ranking_avg > b.ranking.ranking_avg) {
            return -1;
          } else if (a.ranking.ranking_avg < b.ranking.ranking_avg) {
            return 1;
          } else {
            return 0;
          }
        });
        resultArray.forEach((y: any, key: number) => {
          if (key <= 199) {
            orderedResultArray.push(y);
          }
        });
        if (orderedResultArray.length > 0) {
          return res.status(200).json({ status: "success", data: orderedResultArray });
        } else {
          return res.status(404).json({ status: "error", message: "No Positive Ranking Available" });
        };
      }
    })


  } catch (error: any) {
    res.status(409).json({
      error: error.message,
    });
  }
}
