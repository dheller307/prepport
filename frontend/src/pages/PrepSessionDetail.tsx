import { useState, useEffect } from "react";
import { PrepSession } from "../types/prepSession";
import { Batch, CreateBatchRequest } from "../types/batch";
import { Ingredient } from "../types/ingredient";
import { PortionLogResponse } from "../types/portionLog";
import { getPrepSession } from "../api/prepSessions";
import { createBatch, updateBatch, deleteBatch } from "../api/batches";
import { listIngredients } from "../api/ingredients";
import { listPortionLogs } from "../api/portionLogs";

type PrepSessionDetailProps = {
    id: number;
    onBack: () => void;
}

export function PrepSessionDetail({ id, onBack }: PrepSessionDetailProps) {
    
    const emptyBatchForm: CreateBatchRequest = {
        ingredientId: 0,
        rawWeightG: 0,
        cookedWeightG: 0,
    };
    
    const [prepSession, setPrepSession] = useState<PrepSession | null>(null);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [portionLogs, setPortionLogs] = useState<PortionLogResponse[]>([]);
    const [loadingErrorIngredients, setLoadingErrorIngredients] = useState<string | null>(null);
    const [loadingErrorSession, setLoadingErrorSession] = useState<string | null>(null);
    const [isLoadingSession, setIsLoadingSession] = useState<boolean>(false);
    const [isLoadingIngredients, setIsLoadingIngredients] = useState<boolean>(false);
    const [loadingErrorPortionLogs, setLoadingErrorPortionLogs] = useState<string | null>(null);
    const [isLoadingPortionLogs, setIsLoadingPortionLogs] = useState<boolean>(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [isBatchFormOpen, setIsBatchFormOpen] = useState<boolean>(false);
    const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
    const [isDeletingBatch, setIsDeletingBatch] = useState<boolean>(false);
    
    const [form, setForm] = useState<CreateBatchRequest>(emptyBatchForm);

    function openAddBatchForm() {
        setEditingBatch(null);
        setForm(emptyBatchForm);
        setIsBatchFormOpen(true);
    }

    function openEditBatchForm(batch: Batch) {
        if (batch.ingredient.id === undefined) {
            setSubmissionError('Batch ingredient is missing an ID');
            return;
        }
        setEditingBatch(batch);
        setForm({
            ingredientId: batch.ingredient.id,
            rawWeightG: batch.rawWeightG,
            cookedWeightG: batch.cookedWeightG,
        });
        setIsBatchFormOpen(true);
    }

    useEffect(() => {
        async function loadIngredients() {
            setLoadingErrorIngredients(null);
            setIsLoadingIngredients(true);
            try {
                const response = await listIngredients();
                setIngredients(response);
            } catch (error) {
                setLoadingErrorIngredients(error instanceof Error ? error.message : 'Failed to load ingredients');
            } finally {
                setIsLoadingIngredients(false);
            }
        }
        loadIngredients();
    }, []);

    useEffect(() => {
        async function loadPrepSession() {
            setLoadingErrorSession(null);
            setIsLoadingSession(true);
            try {
                const response = await getPrepSession(id);
                setPrepSession(response);
            } catch (error) {
                setLoadingErrorSession(error instanceof Error ? error.message : 'Failed to load prep session');
            } finally {
                setIsLoadingSession(false);
            }
        }
        loadPrepSession();
    }, [id]);

    useEffect(() => {
        async function loadPortionLogs() {
            setLoadingErrorPortionLogs(null);
            setIsLoadingPortionLogs(true);
            try {
                const response = await listPortionLogs();
                setPortionLogs(response);
            } catch (error) {
                setLoadingErrorPortionLogs(error instanceof Error ? error.message : 'Failed to load meal history');
            } finally {
                setIsLoadingPortionLogs(false);
            }
        }
        loadPortionLogs();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmissionError(null);
        setIsSubmitting(true);
        try {
            const isEditing = editingBatch?.id !== undefined;
            const response = isEditing ? await updateBatch(id, editingBatch.id!, form) : await createBatch(id, form);
            if (isEditing) {
                setPrepSession((current) => current ? { ...current, batches: (current.batches ?? []).map((batch) => batch.id === editingBatch.id ? response : batch) } : current);
            } else {
                setPrepSession((current) => current ? { ...current, batches: [...(current.batches ?? []), response] } : current);
            }
            setForm(emptyBatchForm);
            setEditingBatch(null);
            setIsBatchFormOpen(false);
        } catch (error) {
            setSubmissionError(error instanceof Error ? error.message : 'Failed to create batch');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDeleteBatch(batchId: number) {
        if (!window.confirm('Are you sure you want to delete this batch?')) {
            return;
        }
        
        setSubmissionError(null);
        setIsDeletingBatch(true);

        try {
            await deleteBatch(id, batchId);
            setPrepSession((current) => current ? { ...current, batches: (current.batches ?? []).filter((batch) => batch.id !== batchId) } : current);
        } catch (error) {
            setSubmissionError(error instanceof Error ? error.message : 'Failed to delete batch');
        } finally {
            setIsDeletingBatch(false);
        }
    }

    function formatYield(batch: Batch) {
        return `${((batch.cookedWeightG / batch.rawWeightG) * 100).toFixed(1)}%`;
    }

    function calculateUsedCookedGrams(batch: Batch) {
        if (batch.id === undefined) {
            return 0;
        }
        return portionLogs.flatMap((log) => log.lines).filter((line) => line.batchId === batch.id).reduce((total, line) => total + line.cookedGrams, 0);
    }

    function calculateAvailableCookedGrams(batch: Batch) {
        if (batch.id === undefined) {
            return 0;
        }
        return batch.cookedWeightG - calculateUsedCookedGrams(batch);
    }

    return (
        <div>
            {submissionError && <p>{submissionError}</p>}
            {loadingErrorSession && <p>{loadingErrorSession}</p>}
            {loadingErrorPortionLogs && <p>{loadingErrorPortionLogs}</p>}
            {isLoadingSession && <p>Loading prep session...</p>}
            {isLoadingPortionLogs && <p>Loading meal history...</p>}
            {!isLoadingSession && !loadingErrorSession && prepSession && (
                <div>
                    <div className="prep-session-heading">
                        <h1>Prep Session: {prepSession.name}</h1>
                        <button type="button" onClick={onBack}>Back to prep sessions</button>
                    </div>
                    <p className="page-lede">{prepSession.sessionDate}</p>
                    {prepSession.notes && <p>Notes: {prepSession.notes}</p>}
                    <button type="button" onClick={openAddBatchForm}>
                        Add batch
                    </button>

                    {isBatchFormOpen && (
                        <form className="entity-form" onSubmit={handleSubmit}>
                            <h2>{editingBatch ? 'Edit batch' : 'Add batch'}</h2>
                            <div className="form-field">
                                <label htmlFor="ingredientId">Ingredient</label>
                                {loadingErrorIngredients && <p>{loadingErrorIngredients}</p>}
                                <select id="ingredientId" value={form.ingredientId || ''} disabled={isLoadingIngredients || !!loadingErrorIngredients} onChange={(e) => setForm({ ...form, ingredientId: Number(e.target.value) })}>
                                    <option value="" disabled>{isLoadingIngredients ? 'Loading ingredients...' : 'Select an ingredient'}</option>
                                    {ingredients.map((ingredient) => (
                                        <option key={ingredient.id} value={ingredient.id}>{ingredient.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-field">
                                <label htmlFor="rawWeightG">Raw weight (g)</label>
                                <input type="number" id="rawWeightG" value={form.rawWeightG === 0 ? '' : form.rawWeightG} onChange={(e) => setForm({ ...form, rawWeightG: Number(e.target.value) })} />
                            </div>
                            <div className="form-field">
                                <label htmlFor="cookedWeightG">Cooked weight (g)</label>
                                <input type="number" id="cookedWeightG" value={form.cookedWeightG === 0 ? '' : form.cookedWeightG} onChange={(e) => setForm({ ...form, cookedWeightG: Number(e.target.value) })} />
                            </div>
                            <p className="hint">
                                Both weights are required. If nothing changed in the pan, enter the same number twice.
                            </p>
                            <div className="form-actions">
                                <button type="submit" disabled={isSubmitting || isLoadingIngredients || !!loadingErrorIngredients || !form.ingredientId || !form.rawWeightG || !form.cookedWeightG}>
                                    {isSubmitting ? 'Saving...' : editingBatch ? 'Save changes' : 'Add batch'}
                                </button>
                                <button type="button" onClick={() => {
                                    setForm(emptyBatchForm);
                                    setEditingBatch(null);
                                    setIsBatchFormOpen(false);
                                }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    {!prepSession.batches?.length ? (
                        <p>No batches yet</p>
                    ) : (
                        <ul className="batch-list">
                            {prepSession.batches?.map((batch) => (
                                <li key={batch.id} className="batch-card">
                                    <h2>{batch.ingredient.name}</h2>
                                    <section className="batch-inventory" aria-label="Batch inventory">
                                        <dl className="batch-stats">
                                            <div>
                                                <dt>Raw</dt>
                                                <dd>{batch.rawWeightG} g</dd>
                                            </div>
                                            <div>
                                                <dt>Cooked</dt>
                                                <dd>{batch.cookedWeightG} g</dd>
                                            </div>
                                            <div>
                                                <dt>Yield</dt>
                                                <dd>{formatYield(batch)}</dd>
                                            </div>
                                            <div>
                                                <dt>Available</dt>
                                                <dd>{calculateAvailableCookedGrams(batch).toFixed(1)} g</dd>
                                            </div>
                                        </dl>
                                    </section>
                                    {batch.id !== undefined && !isLoadingPortionLogs && (
                                        <details className="batch-history">
                                            <summary>
                                                <span className="batch-history-title">
                                                    <span className="batch-history-indicator" aria-hidden="true">▸</span>
                                                    Meal history
                                                </span>
                                                <span>
                                                    {calculateUsedCookedGrams(batch) === 0
                                                        ? "No meals yet"
                                                        : `${calculateUsedCookedGrams(batch).toFixed(1)} g used`}
                                                </span>
                                            </summary>
                                            <div className="batch-history-content">
                                                {calculateUsedCookedGrams(batch) === 0 ? (
                                                    <p>No meals have used this batch yet.</p>
                                                ) : (
                                                    <ul>
                                                        {portionLogs.flatMap((log) =>
                                                            log.lines
                                                                .filter((line) => line.batchId === batch.id)
                                                                .map((line) => (
                                                                    <li key={log.id}>
                                                                        {log.portionDate} · {log.name} · {line.cookedGrams} g used
                                                                    </li>
                                                                ))
                                                        )}
                                                    </ul>
                                                )}
                                            </div>
                                        </details>
                                    )}
                                    {batch.id !== undefined && (
                                        <div className="form-actions batch-actions">
                                            <button type="button" onClick={() => openEditBatchForm(batch)}>
                                                Edit
                                            </button>
                                            <button type="button" onClick={() => {
                                                if (batch.id !== undefined) {
                                                    handleDeleteBatch(batch.id);
                                                }
                                            }} disabled={isDeletingBatch}>
                                                {isDeletingBatch ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    )
}