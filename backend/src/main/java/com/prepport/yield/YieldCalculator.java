package com.prepport.yield;

import org.springframework.stereotype.Component;

@Component
public class YieldCalculator {
    public double yieldRatio(double rawWeightG, double cookedWeightG) {
        return (double) cookedWeightG / rawWeightG;
    }

    public double rawEquivalentG(double cookedPortionG, double rawBatchG, double cookedBatchG) {
        return cookedPortionG * rawBatchG / cookedBatchG;
    }

    public double calculateForCookedPortion(double cookedPortionG, double rawBatchG, double cookedBatchG, double per100gRaw) {
        return calculateForPortion(rawEquivalentG(cookedPortionG, rawBatchG, cookedBatchG), per100gRaw);
    }

    public double calculateForMatchingBasis(double portionG, double per100g) {
        return calculateForPortion(portionG, per100g);
    }

    private double calculateForPortion(double portionG, double per100g) {
        return per100g * portionG / 100;
    }
}