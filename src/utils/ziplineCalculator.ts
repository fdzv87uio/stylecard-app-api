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
        const betaKey = item.category + "_hip";
        const hipBeta = userStylePreferences[betaKey];
        const currentBetaObject = LambdaEquivalenceTable.filter((x) => x.number === hipBeta)[0];
        const betaRatio = currentBetaObject ? currentBetaObject.ratio : 1;
        // calculate Z for hip
        const hipZ = ((userHip * betaRatio) + sizeGuideHip) / 2;
        // calculate User Distance from Z
        const DistanceFromHipZ = userHip - hipZ;
        // get ranking ratio from distance
        const hipRanking = getRankingFromScalar(DistanceFromHipZ, userMeasurements.unit);
        resultObject.hip_ranking = hipRanking ? hipRanking : 0;
        // MEASURE CHEST RANKING
        // prepare vars
        const userChest = userMeasurements.chest;
        const sizeGuideChest = itemSize.chest;
        const chestBetaKey = item.category + "_chest";
        const chestBeta = userStylePreferences[chestBetaKey];
        const currentChestBetaObject = LambdaEquivalenceTable.filter((x) => x.number === chestBeta)[0];
        const chestBetaRatio = currentChestBetaObject ? currentChestBetaObject.ratio : 1;
        // calculate Z for hip
        const chestZ = ((userChest * chestBetaRatio) + sizeGuideChest) / 2;
        // calculate User Distance from Z
        const DistanceFromChestZ = userChest - chestZ;
        // get ranking ratio from distance
        const chestRanking = getRankingFromScalar(DistanceFromChestZ, userMeasurements.unit);
        resultObject.chest_ranking = chestRanking ? chestRanking : 0;
        // MEASURE WAIST RANKING
        // prepare vars
        const userWaist = userMeasurements.waist;
        const sizeGuideWaist = itemSize.waist;
        const waistBetaKey = item.category + "_waist";
        const waistBeta = userStylePreferences[waistBetaKey];
        const currentWaistBetaObject = LambdaEquivalenceTable.filter((x) => x.number === waistBeta)[0];
        const waistBetaRatio = currentWaistBetaObject ? currentWaistBetaObject.ratio : 1;
        // calculate Z for waist
        const waistZ = ((userWaist * waistBetaRatio) + sizeGuideWaist) / 2;
        // calculate User Distance from Z
        const DistanceFromWaistZ = userWaist - waistZ;
        // get ranking ratio from distance
        const waistRanking = getRankingFromScalar(DistanceFromWaistZ, userMeasurements.unit);
        resultObject.waist_ranking = waistRanking ? waistRanking : 0;

        //CALCULATE OVERALL AVERAGE
        if (hipRanking && chestRanking && waistRanking) {
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
    } else if (currentValue > 0 && currentValue < 0.5) {
        return 0.75;
    } else if (currentValue >= 0.5 && currentValue < 1) {
        return 0.5;
    } else if (currentValue >= 1 && currentValue < 1.5) {
        return 0.25;
    } else if (currentValue >= 1.5 && currentValue < 2) {
        return 0.1;
    } else {
        return 0;
    }
}