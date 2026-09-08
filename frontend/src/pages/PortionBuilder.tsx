import { useState, useEffect, useRef } from "react";
import type { PrepSession } from "../types/prepSession";
import type {
  PortionCalculateRequest,
  PortionCalculateResponse,
} from "../types/portion";
import type {
  PortionLogResponse,
  PortionLogRequest,
} from "../types/portionLog";
import { calculatePortion, exportPortion } from "../api/portion";
import {
  listPortionLogs,
  updatePortionLog,
  deletePortionLog,
  createPortionLog,
} from "../api/portionLogs";
import { listPrepSessions } from "../api/prepSessions";

export function PortionBuilder() {
  function getTodayLocalDateString(): string {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  }

  function formatAmount(value: number): string {
    return value.toFixed(2).replace(/\.?0+$/, "");
  }

  const [prepSessions, setPrepSessions] = useState<PrepSession[]>([]);
  const [prepSessionLoadingError, setPrepSessionLoadingError] = useState<
    string | null
  >(null);
  const [prepSessionIsLoading, setPrepSessionIsLoading] =
    useState<boolean>(false);
  const [lines, setLines] = useState<PortionCalculateRequest[]>([]);
  const [results, setResults] = useState<(PortionCalculateResponse | null)[]>(
    [],
  );
  const [exportText, setExportText] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [calculateError, setCalculateError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [portionLogs, setPortionLogs] = useState<PortionLogResponse[]>([]);
  const [portionLogName, setPortionLogName] = useState("");
  const [portionDate, setPortionDate] = useState(getTodayLocalDateString());
  const [editingPortionLogId, setEditingPortionLogId] = useState<number | null>(
    null,
  );
  const [portionLogIsLoading, setPortionLogIsLoading] = useState(false);
  const [portionLogError, setPortionLogError] = useState<string | null>(null);
  const [isSavingPortionLog, setIsSavingPortionLog] = useState(false);
  const [isDeletingPortionLog, setIsDeletingPortionLog] = useState(false);

  useEffect(() => {
    async function loadPrepSessions() {
      setPrepSessionLoadingError(null);
      setPrepSessionIsLoading(true);
      try {
        const response = await listPrepSessions();
        setPrepSessions(response);
      } catch (prepSessionLoadError) {
        setPrepSessionLoadingError(
          prepSessionLoadError instanceof Error
            ? prepSessionLoadError.message
            : "Failed to load prep sessions",
        );
      } finally {
        setPrepSessionIsLoading(false);
      }
    }
    loadPrepSessions();
  }, []);

  useEffect(() => {
    async function loadPortionLogs() {
      setPortionLogIsLoading(true);
      setPortionLogError(null);
      try {
        const response = await listPortionLogs();
        setPortionLogs(response);
      } catch (portionLogLoadError) {
        setPortionLogError(
          portionLogLoadError instanceof Error
            ? portionLogLoadError.message
            : "Failed to load meals",
        );
      } finally {
        setPortionLogIsLoading(false);
      }
    }
    loadPortionLogs();
  }, []);

  function clearPortionLogForm() {
    setLines([]);
    setResults([]);
    setExportText(null);
    setPortionLogName("");
    setPortionDate(getTodayLocalDateString());
    setEditingPortionLogId(null);
  }

  function calculateAvailableCookedGrams(batchId: number) {
    const batch = batches.find((batch) => batch.id === batchId);

    if (!batch) {
      return 0;
    }

    const usedCookedGrams = portionLogs
      .filter((log) => log.id !== editingPortionLogId)
      .flatMap((log) => log.lines)
      .filter((line) => line.batchId === batchId)
      .reduce((total, line) => total + line.cookedGrams, 0);

    return batch.cookedWeightG - usedCookedGrams;
  }

  function handleAddLine() {
    setLines((prev) => [...prev, { batchId: 0, cookedGrams: 0 }]);
    setResults((prev) => [...prev, null]);
  }

  function handleRemoveLine(index: number) {
    setLines((prev) => prev.filter((_, i) => i !== index));
    setResults((prev) => prev.filter((_, i) => i !== index));
  }

  function updateLineBatch(index: number, batchId: number) {
    setLines((prev) =>
      prev.map((line, i) => (i === index ? { ...line, batchId } : line)),
    );
    setResults((prev) =>
      prev.map((result, i) => (i === index ? null : result)),
    );
  }

  function updateLineGrams(index: number, cookedGrams: number) {
    setLines((prev) =>
      prev.map((line, i) => (i === index ? { ...line, cookedGrams } : line)),
    );
    setResults((prev) =>
      prev.map((result, i) => (i === index ? null : result)),
    );
  }

  async function calculateLine(index: number) {
    setCalculateError(null);
    setIsCalculating(true);
    try {
      const response = await calculatePortion(lines[index]);
      setResults((prev) =>
        prev.map((result, i) => (i === index ? response : result)),
      );
    } catch (calculateError) {
      setCalculateError(
        calculateError instanceof Error
          ? calculateError.message
          : "Failed to calculate meal ingredient",
      );
    } finally {
      setIsCalculating(false);
    }
  }

  function getValidLines() {
    return lines.filter((line) => line.batchId > 0 && line.cookedGrams > 0);
  }

  const validLines = getValidLines();
  const calculatedResults = results.filter(
    (result): result is PortionCalculateResponse => result !== null,
  );
  const hasCompleteNutrition =
    lines.length > 0 &&
    validLines.length === lines.length &&
    calculatedResults.length === lines.length;
  const currentMealTotals = calculatedResults.reduce(
    (totals, result) => ({
      proteinG: totals.proteinG + result.proteinG,
      carbsG: totals.carbsG + result.carbsG,
      fatG: totals.fatG + result.fatG,
      kcal: totals.kcal + result.kcal,
    }),
    { proteinG: 0, carbsG: 0, fatG: 0, kcal: 0 },
  );

  async function handleExport() {
    setExportError(null);
    setIsExporting(true);
    try {
      const response = await exportPortion({ lines: validLines });
      setExportText(response);
    } catch (exportError) {
      setExportError(
        exportError instanceof Error
          ? exportError.message
          : "Failed to generate nutrition-tracker text",
      );
      setExportText(null);
    } finally {
      setIsExporting(false);
    }
  }

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(exportText ?? "");
      setCopyFeedback("Copied to clipboard");
    } catch (copyError) {
      setCopyFeedback("Failed to copy to clipboard");
    } finally {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        setCopyFeedback(null);
      }, 3000);
    }
  }

  async function handleSavePortionLog() {
    setPortionLogError(null);

    if (!portionLogName.trim()) {
      setPortionLogError("A meal name is required");
      return;
    }

    if (!portionDate) {
      setPortionLogError("Portion date is required");
      return;
    }

    if (validLines.length === 0 || validLines.length !== lines.length) {
      setPortionLogError(
        "All lines must have a batch and positive cooked grams",
      );
      return;
    }

    const request: PortionLogRequest = {
      name: portionLogName.trim(),
      portionDate: portionDate,
      lines: validLines,
    };

    setIsSavingPortionLog(true);
    try {
      const response =
        editingPortionLogId !== null
          ? await updatePortionLog(editingPortionLogId, request)
          : await createPortionLog(request);
      setPortionLogs((prev) => [
        response,
        ...prev.filter((log) => log.id !== response.id),
      ]);
      clearPortionLogForm();
    } catch (portionLogSaveError) {
      setPortionLogError(
        portionLogSaveError instanceof Error
          ? portionLogSaveError.message
          : "Failed to save meal",
      );
    } finally {
      setIsSavingPortionLog(false);
    }
  }

  function handleEditPortionLog(portionLog: PortionLogResponse) {
    setLines(
      portionLog.lines.map((line) => ({
        batchId: line.batchId,
        cookedGrams: line.cookedGrams,
      })),
    );
    setResults(portionLog.lines.map(() => null));
    setPortionLogName(portionLog.name);
    setPortionDate(portionLog.portionDate);
    setEditingPortionLogId(portionLog.id);
    setPortionLogError(null);
  }

  async function handleDeletePortionLog(id: number) {
    if (!window.confirm("Are you sure you want to delete this meal?")) {
      return;
    }

    setIsDeletingPortionLog(true);
    setPortionLogError(null);

    try {
      await deletePortionLog(id);
      setPortionLogs((prev) => prev.filter((log) => log.id !== id));
      if (editingPortionLogId === id) {
        clearPortionLogForm();
      }
    } catch (portionLogDeleteError) {
      setPortionLogError(
        portionLogDeleteError instanceof Error
          ? portionLogDeleteError.message
          : "Failed to delete meal",
      );
    } finally {
      setIsDeletingPortionLog(false);
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const batches = prepSessions.flatMap((session) => session.batches ?? []);

  return (
    <div>
      <h1>Meal Builder</h1>
      <p className="page-lede">
        Combine cooked amounts from your prep batches into one meal, then save
        it or copy its nutrition-tracker text.
      </p>
      {prepSessionLoadingError && <p>{prepSessionLoadingError}</p>}
      {prepSessionIsLoading && <p>Loading prep sessions...</p>}
      {!prepSessionIsLoading &&
        !prepSessionLoadingError &&
        prepSessions.length === 0 && (
          <p>No prep sessions found. Create a prep session first.</p>
        )}
      {!prepSessionIsLoading &&
        !prepSessionLoadingError &&
        prepSessions.length > 0 &&
        batches.length < 1 && (
          <p>No batches found for any prep session. Create a batch first.</p>
        )}
      {!prepSessionIsLoading &&
        !prepSessionLoadingError &&
        prepSessions.length > 0 &&
        batches.length > 0 && (
          <>
            <section className="meal-builder-card">
              <div className="meal-builder-heading">
                <p className="step-label">Step 1</p>
                <h2>Build this meal</h2>
                <p className="hint">
                  Add the cooked amount you plan to eat from each prep batch.
                </p>
              </div>
              <button type="button" onClick={handleAddLine}>
                Add ingredient
              </button>
              {lines.length < 1 && (
                <p>Add an ingredient batch to start building a meal.</p>
              )}
              {lines.length > 0 && (
                <ul className="meal-line-list">
                  {lines.map((line, index) => (
                    <li key={index} className="portion-line">
                      <label>
                        Ingredient batch
                        <select
                          value={line.batchId || ""}
                          onChange={(e) =>
                            updateLineBatch(index, Number(e.target.value))
                          }
                        >
                          <option value="">Select a batch</option>
                          {batches.map((batch) => (
                            <option key={batch.id} value={batch.id}>
                              {batch.ingredient.name} -{" "}
                              {batch.createdAt?.split("T")[0]} -{" "}
                              {formatAmount(batch.rawWeightG)} g raw /{" "}
                              {formatAmount(batch.cookedWeightG)} g cooked
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Cooked grams
                        <input
                          type="number"
                          placeholder="0"
                          value={line.cookedGrams === 0 ? "" : line.cookedGrams}
                          onChange={(e) =>
                            updateLineGrams(index, Number(e.target.value))
                          }
                        />
                      </label>
                      {line.batchId > 0 && (
                        <p className="hint">
                          {formatAmount(
                            calculateAvailableCookedGrams(line.batchId),
                          )}{" "}
                          g available
                        </p>
                      )}
                      <div className="portion-line-actions">
                        <button
                          type="button"
                          onClick={() => calculateLine(index)}
                          disabled={isCalculating}
                        >
                          {isCalculating
                            ? "Calculating..."
                            : "Calculate nutrition"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveLine(index)}
                        >
                          Remove ingredient
                        </button>
                      </div>
                      {results[index] && (
                        <div className="meal-nutrition-result">
                          <p>
                            Nutrition-tracker amount:{" "}
                            {formatAmount(results[index].cronometerG)} g
                          </p>
                          <p>
                            Protein: {formatAmount(results[index].proteinG)} g ·
                            Fat: {formatAmount(results[index].fatG)} g · Carbs:{" "}
                            {formatAmount(results[index].carbsG)} g · Calories:{" "}
                            {formatAmount(results[index].kcal)} kcal
                          </p>
                        </div>
                      )}
                    </li>
                  ))}
                  {calculateError && <p>{calculateError}</p>}
                  {isCalculating && <p>Calculating...</p>}
                </ul>
              )}
              <div className="meal-builder-heading">
                <p className="step-label">Step 2</p>
                <h2>
                  {editingPortionLogId === null
                    ? "Name this meal"
                    : `Editing: ${portionLogName}`}
                </h2>
                <p className="hint">
                  Saving records these cooked amounts and updates each
                  batch&apos;s available amount.
                </p>
              </div>
              <div className="form-field">
                <label htmlFor="portionLogName">Meal name</label>
                <input
                  id="portionLogName"
                  value={portionLogName}
                  onChange={(e) => setPortionLogName(e.target.value)}
                  placeholder="Example: Tuesday lunch"
                />
              </div>
              <div className="form-field">
                <label htmlFor="portionDate">Date</label>
                <input
                  id="portionDate"
                  type="date"
                  value={portionDate}
                  onChange={(e) => setPortionDate(e.target.value)}
                />
              </div>
              <div className="meal-builder-heading">
                <p className="step-label">Step 3</p>
                <h2>Review and finish</h2>
                <p className="hint">
                  Save the meal to track batch usage. Generating tracker text
                  only prepares copyable text, it does not save the meal or
                  change availability.
                </p>
              </div>
              {hasCompleteNutrition ? (
                <div className="meal-aggregate-nutrition">
                  <h3>Meal nutrition</h3>
                  <p>
                    Protein: {formatAmount(currentMealTotals.proteinG)} g · Fat:{" "}
                    {formatAmount(currentMealTotals.fatG)} g · Carbs:{" "}
                    {formatAmount(currentMealTotals.carbsG)} g · Calories:{" "}
                    {formatAmount(currentMealTotals.kcal)} kcal
                  </p>
                </div>
              ) : (
                <p className="hint">
                  Calculate nutrition for each ingredient to see the meal total.
                </p>
              )}
              <div className="meal-finish-actions">
                <button
                  type="button"
                  onClick={handleSavePortionLog}
                  disabled={
                    isSavingPortionLog ||
                    !portionLogName.trim() ||
                    validLines.length === 0 ||
                    validLines.length !== lines.length
                  }
                >
                  {isSavingPortionLog
                    ? "Saving..."
                    : editingPortionLogId === null
                      ? "Save meal"
                      : "Save meal changes"}
                </button>
                <button
                  type="button"
                  onClick={handleExport}
                  disabled={isExporting || validLines.length === 0}
                >
                  {isExporting
                    ? "Generating..."
                    : "Generate nutrition-tracker text"}
                </button>
                {editingPortionLogId !== null && (
                  <button type="button" onClick={clearPortionLogForm}>
                    Cancel meal edit
                  </button>
                )}
              </div>
              {portionLogError && (
                <p className="form-error" role="alert">
                  {portionLogError}
                </p>
              )}
              {exportError && <p>{exportError}</p>}
              {exportText && (
                <div className="meal-export-result">
                  <h3>Nutrition-tracker text</h3>
                  <pre className="export-pre">{exportText}</pre>
                  <button
                    type="button"
                    onClick={handleCopy}
                    disabled={!exportText}
                  >
                    Copy nutrition-tracker text
                  </button>
                  {copyFeedback && <p>{copyFeedback}</p>}
                </div>
              )}
            </section>
            <section className="recent-meals">
              <h2>Recent meals</h2>
              <p className="hint">
                Edit or delete a meal to update its recorded batch usage.
              </p>
              {portionLogIsLoading && <p>Loading recent meals...</p>}
              {!portionLogIsLoading && portionLogs.length === 0 && (
                <p>No recent meals yet.</p>
              )}
              {!portionLogIsLoading && portionLogs.length > 0 && (
                <ul className="card-list">
                  {portionLogs.map((portionLog) => (
                    <li key={portionLog.id} className="card">
                      <h3>{portionLog.name}</h3>
                      <p>{portionLog.portionDate}</p>
                      <ul>
                        {portionLog.lines.map((line) => (
                          <li key={line.batchId}>
                            {line.ingredientName}:{" "}
                            {formatAmount(line.cookedGrams)} g
                          </li>
                        ))}
                      </ul>
                      <div className="meal-card-totals">
                        <p>
                          Protein: {formatAmount(portionLog.totalProteinG)} g ·
                          Fat: {formatAmount(portionLog.totalFatG)} g · Carbs:{" "}
                          {formatAmount(portionLog.totalCarbsG)} g · Calories:{" "}
                          {formatAmount(portionLog.totalKcal)} kcal
                        </p>
                      </div>
                      <div className="form-actions">
                        <button
                          type="button"
                          onClick={() => handleEditPortionLog(portionLog)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePortionLog(portionLog.id)}
                          disabled={isDeletingPortionLog}
                        >
                          {isDeletingPortionLog ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
    </div>
  );
}
