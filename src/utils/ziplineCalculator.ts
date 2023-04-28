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
        // MEASURE HIP RANKING
        // prepare vars
        const userHip = userMeasurements.hip;
        const sizeGuideHip = itemSize.hip;
        const lambdaKey = item.category + "_hip";
        const hipLambda = userStylePreferences[lambdaKey];
        const currentlambdaObject = LambdaEquivalenceTable.filter((x) => x.number === hipLambda)[0];
        const lambdaRatio = currentlambdaObject ? currentlambdaObject.ratio : 0.5;
        // calculate Z for hip
        const hipZ = (userHip * lambdaRatio) + (sizeGuideHip * (1 - lambdaRatio));
        // calculate User Distance from Z
        const DistanceFromHipZ = userHip - hipZ;
        // get ranking ratio from distance
        const hipRanking = getRankingFromScalar(DistanceFromHipZ, userMeasurements.unit);
        resultObject.hip_ranking = hipRanking ? hipRanking : 0;
        // MEASURE CHEST RANKING
        // prepare vars
        const userChest = userMeasurements.chest;
        const sizeGuideChest = itemSize.chest;
        const chestLambdaKey = item.category + "_chest";
        const chestLambda = userStylePreferences[chestLambdaKey];
        const currentChestLambdaObject = LambdaEquivalenceTable.filter((x) => x.number === chestLambda)[0];
        const chestLambdaRatio = currentChestLambdaObject ? currentChestLambdaObject.ratio : 0.5;
        // calculate Z for hip
        const chestZ = (userChest * chestLambdaRatio) + (sizeGuideChest * (1 - chestLambdaRatio));
        // calculate User Distance from Z
        const DistanceFromChestZ = userChest - chestZ;
        // get ranking ratio from distance
        const chestRanking = getRankingFromScalar(DistanceFromChestZ, userMeasurements.unit);
        resultObject.chest_ranking = chestRanking ? chestRanking : 0;
        // MEASURE WAIST RANKING
        // prepare vars
        const userWaist = userMeasurements.waist;
        const sizeGuideWaist = item.waist;
        const waistLambdaKey = item.category + "_waist";
        const waistLambda = userStylePreferences[waistLambdaKey];
        const currentWaistLambdaObject = LambdaEquivalenceTable.filter((x) => x.number === waistLambda)[0];
        const waistLambdaRatio = currentWaistLambdaObject ? currentWaistLambdaObject.ratio : 0.5;
        // calculate Z for waist
        const waistZ = (userWaist * waistLambdaRatio) + (sizeGuideWaist * (1 - waistLambdaRatio));
        // calculate User Distance from Z
        const DistanceFromWaistZ = userWaist - waistZ;
        // get ranking ratio from distance
        const waistRanking = getRankingFromScalar(DistanceFromWaistZ, userMeasurements.unit);
        resultObject.waist_ranking = waistRanking ? waistRanking : 0;

        //CALCULATE OVERALL AVERAGE
        resultObject.ranking_avg = ((hipRanking ? hipRanking : 0) + (chestRanking ? chestRanking : 0) + (waistRanking ? waistRanking : 0)) / 3;
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
    if (currentValue < -2) {
        return 0;
    } else if (currentValue > 0) {
        return 0;
    } else if (currentValue >= -2 && currentValue < -1.5) {
        return 0.25;
    } else if (currentValue >= -1.5 && currentValue < -1) {
        return 0.5;
    } else if (currentValue >= -1 && currentValue < -0.5) {
        return 0.75;
    } else if (currentValue >= -0.5 && currentValue < 0) {
        return 1;
    } else if (currentValue === 0) {
        return 1;
    } else {
        return 0;
    }
}