import { LambdaEquivalenceTable } from "@/constants/LambdaEquivalenceTable";

export function getZiplineRanking(userMeasurements: any, userStylePreferences: any, item: any) {
    if (userMeasurements && userStylePreferences && item) {

        let resultObject = {
            ranking_avg: 0,
            chest_ranking: 0,
            waist_ranking: 0,
            hip_ranking: 0,
        }
        const itemSize = item.size;
        const formattedCategory = item.category.replace("-", "_").trim();
        // MEASURE HIP RANKING
        // prepare vars
        const userHip = userMeasurements.hip;
        const sizeGuideHip = itemSize.hip;
        const lambdaKey = formattedCategory + "_hip";
        const hipLambda = userStylePreferences[lambdaKey];
        const currentLambdaObject = LambdaEquivalenceTable.filter((x) => x.number === hipLambda)[0];
        const lambdaRatio = currentLambdaObject ? currentLambdaObject.ratio : 1;
        // calculate Z for hip
        const hipZ = ((userHip * lambdaRatio) + sizeGuideHip) / 2;
        // calculate User Distance from Z
        const DistanceFromHipZ = (userHip * lambdaRatio) - hipZ;
        // get ranking ratio from distance
        const hipRanking = getRankingFromScalar(DistanceFromHipZ, userMeasurements.unit);
        resultObject.hip_ranking = hipRanking ? hipRanking : 0;
        // MEASURE CHEST RANKING
        // prepare vars
        const userChest = userMeasurements.chest;
        const sizeGuideChest = itemSize.chest;
        const chestLambdaKey = formattedCategory + "_chest";
        const chestLambda = userStylePreferences[chestLambdaKey];
        const currentChestLambdaObject = LambdaEquivalenceTable.filter((x) => x.number === chestLambda)[0];
        const chestLambdaRatio = currentChestLambdaObject ? currentChestLambdaObject.ratio : 1;
        // calculate Z for hip
        const chestZ = ((userChest * chestLambdaRatio) + sizeGuideChest) / 2;
        // calculate User Distance from Z
        const DistanceFromChestZ = (userChest * chestLambdaRatio) - chestZ;
        // get ranking ratio from distance
        const chestRanking = getRankingFromScalar(DistanceFromChestZ, userMeasurements.unit);
        resultObject.chest_ranking = chestRanking ? chestRanking : 0;
        // MEASURE WAIST RANKING
        // prepare vars
        const userWaist = userMeasurements.waist;
        const sizeGuideWaist = itemSize.waist;
        const waistLambdaKey = formattedCategory + "_waist";
        const waistLambda = userStylePreferences[waistLambdaKey];
        const currentWaistLambdaObject = LambdaEquivalenceTable.filter((x) => x.number === waistLambda)[0];
        const waistLambdaRatio = currentWaistLambdaObject ? currentWaistLambdaObject.ratio : 1;
        // calculate Z for waist
        const waistZ = ((userWaist * waistLambdaRatio) + sizeGuideWaist) / 2;
        // calculate User Distance from Z
        const DistanceFromWaistZ = (userWaist * waistLambdaRatio) - waistZ;
        // get ranking ratio from distance
        const waistRanking = getRankingFromScalar(DistanceFromWaistZ, userMeasurements.unit);
        resultObject.waist_ranking = waistRanking ? waistRanking : 0;

        //CALCULATE OVERALL AVERAGE
        if (hipRanking && hipRanking > 0 && chestRanking && chestRanking > 0 && waistRanking && waistRanking > 0) {
            resultObject.ranking_avg = (hipRanking + chestRanking + waistRanking) / 3;
        } else {
            resultObject.ranking_avg = 0;
        }

        return resultObject;
    } else {
        return 0;
    }
}

function getRankingFromScalar(value: number, unit: string) {
    let currentValue = value;
    if (unit === "centimeters") {
        currentValue = value * 0.393701;
    }
    if (currentValue < -3 || currentValue > 0) {
        return 0;
    } else {
        return (value * -1) / 3
    }
}