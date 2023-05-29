import { connectMongoose } from "@/utils/connectMongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { runMiddleware } from "@/utils/corsUtil";
import User from "@/models/User";
import Product from "@/models/Product";
import StylePreference from "@/models/StylePreference";
import { getZiplineRanking } from "@/utils/ziplineCalculator";

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
    console.log("Fetching products from MongoDB ");
    const productList = await Product.find();
    console.log("Products: " + productList.length);
    console.log("Fetching user Style Preferences ");
    const userStylePreferences = await StylePreference.findOne({ creator_id: user });
    console.log(userStylePreferences);
    let resultArray: any[] = [];
    productList.forEach((item: any) => {
      const userMeasurements = {
        chest: currentUser.chest,
        waist: currentUser.waist,
        hip: currentUser.hips,
        unit: currentUser.units,
      };
      const currentZiplineResult: any = getZiplineRanking(userMeasurements, userStylePreferences, item);
      let resultObject = { item: item, ranking: currentZiplineResult };
      resultArray.push(resultObject);

    })
    return res.status(200).json({ status: "success", data: resultArray });
  } catch (error: any) {
    res.status(409).json({
      error: error.message,
    });
  }
}
