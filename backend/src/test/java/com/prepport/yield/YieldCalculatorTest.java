package com.prepport.yield;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("YieldCalculator tests - Real life chicken batch: 2146g raw, 1600g cooked")
public class YieldCalculatorTest {
    YieldCalculator calc;

    @BeforeEach
    void setUp() {
        calc = new YieldCalculator();
    }

    @Test
    @DisplayName("Yield ratio for 2146g raw and 1600g cooked is 0.746")
    void yieldRatio_chickenPortion_returns0746() {
        double result = calc.yieldRatio(2146, 1600);
        assertEquals(0.746, result, 0.01);
    }

    @Test
    @DisplayName("Raw equivalent for 200g cooked chicken is ~268.25g")
    void rawEquivalentG_chickenPortion_returns268() {
        double result = calc.rawEquivalentG(200, 2146, 1600);
        assertEquals(268.25, result, 0.01);
    }

    @Test
    @DisplayName("Protein for 200g cooked chicken is ~83.16g")
    void proteinForCookedPortion_chickenPortion_returns83() {
        double result = calc.proteinForCookedPortion(200, 2146, 1600, 31.0);
        assertEquals(83.16, result, 0.01);
    }
}
