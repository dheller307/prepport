package com.prepport.yield;

public class YieldCalculator {
    public double yieldRatio(int rawWeightG, int cookedWeightG) {
        return (double) cookedWeightG / rawWeightG;
    }

    public double rawEquivalentG(int cookedPortionG, int rawBatchG, int cookedBatchG) {
        return cookedPortionG * (double) rawBatchG / cookedBatchG;
    }

    public double proteinForCookedPortion(int cookedPortionG, int rawBatchG, int cookedBatchG, double proteinPer100gRaw) {
        return proteinPer100gRaw * rawEquivalentG(cookedPortionG, rawBatchG, cookedBatchG) / 100;
    }
}