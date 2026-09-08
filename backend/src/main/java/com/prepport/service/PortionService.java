package com.prepport.service;

import com.prepport.dto.PortionCalculateRequest;
import com.prepport.dto.PortionCalculateResponse;
import com.prepport.dto.PortionExportRequest;
import com.prepport.entity.Batch;
import com.prepport.entity.Ingredient;
import com.prepport.entity.MacroBasis;
import com.prepport.entity.User;
import com.prepport.repository.BatchRepository;
import com.prepport.yield.YieldCalculator;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PortionService {
  private final BatchRepository batchRepository;
  private final YieldCalculator yieldCalculator;

  public PortionService(BatchRepository batchRepository, YieldCalculator yieldCalculator) {
    this.batchRepository = batchRepository;
    this.yieldCalculator = yieldCalculator;
  }

  public PortionCalculateResponse calculatePortion(PortionCalculateRequest request, User user) {
    Batch batch =
        batchRepository
            .findByIdAndPrepSession_User(request.batchId(), user)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Batch not found"));
    return portionCalculateBatch(batch, request.cookedGrams());
  }

  public PortionCalculateResponse calculateForBatch(Batch batch, double cookedGrams) {
    return portionCalculateBatch(batch, cookedGrams);
  }

  public String exportPortion(PortionExportRequest request, User user) {
    double totalProteinG = 0;
    double totalCarbsG = 0;
    double totalFatG = 0;
    double totalKcal = 0;
    StringBuilder sb = new StringBuilder();
    HashMap<Long, Batch> cache = new HashMap<>();
    sb.append("--- PrepPort nutrition-tracker text ---\n");
    for (PortionCalculateRequest line : request.lines()) {
      Batch batch;
      if (cache.containsKey(line.batchId())) {
        batch = cache.get(line.batchId());
      } else {
        batch =
            batchRepository
                .findByIdAndPrepSession_User(line.batchId(), user)
                .orElseThrow(
                    () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Batch not found"));
        cache.put(line.batchId(), batch);
      }
      PortionCalculateResponse response = portionCalculateBatch(batch, line.cookedGrams());
      totalProteinG += response.proteinG();
      totalCarbsG += response.carbsG();
      totalFatG += response.fatG();
      totalKcal += response.kcal();
      sb.append(response.ingredientName())
          .append(" - ")
          .append(formatAmount(response.cronometerG()))
          .append(" g (")
          .append(batch.getIngredient().getMacroBasis().name().toLowerCase())
          .append(" macro basis)\n");
    }
    sb.append("Total: ")
        .append(formatAmount(totalProteinG))
        .append(" g protein · ")
        .append(formatAmount(totalCarbsG))
        .append(" g carbs · ")
        .append(formatAmount(totalFatG))
        .append(" g fat · ")
        .append(formatAmount(totalKcal))
        .append(" kcal");
    return sb.toString();
  }

  private String formatAmount(double amount) {
    return BigDecimal.valueOf(amount)
        .setScale(2, RoundingMode.HALF_UP)
        .stripTrailingZeros()
        .toPlainString();
  }

  private PortionCalculateResponse portionCalculateBatch(Batch batch, double cookedGrams) {
    double rawWeightG = batch.getRawWeightG();
    double cookedWeightG = batch.getCookedWeightG();
    Long batchId = batch.getId();
    Ingredient ingredient = batch.getIngredient();
    double rawEquivalentG = yieldCalculator.rawEquivalentG(cookedGrams, rawWeightG, cookedWeightG);
    double macroReferenceG =
        (rawWeightG == cookedWeightG || ingredient.getMacroBasis() == MacroBasis.COOKED)
            ? cookedGrams
            : rawEquivalentG;
    double cronometerG =
        (ingredient.getMacroBasis() == MacroBasis.COOKED) ? cookedGrams : rawEquivalentG;
    return new PortionCalculateResponse(
        batchId,
        ingredient.getName(),
        cronometerG,
        yieldCalculator.calculateForMatchingBasis(macroReferenceG, ingredient.getProteinPer100g()),
        yieldCalculator.calculateForMatchingBasis(macroReferenceG, ingredient.getFatPer100g()),
        yieldCalculator.calculateForMatchingBasis(macroReferenceG, ingredient.getCarbsPer100g()),
        yieldCalculator.calculateForMatchingBasis(macroReferenceG, ingredient.getKcalPer100g()));
  }
}
