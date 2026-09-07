import { useState, useEffect } from "react";
import { PrepSession } from "../types/prepSession";
import { Batch, CreateBatchRequest } from "../types/batch";
import { Ingredient } from "../types/ingredient";
import { getPrepSession } from "../api/prepSessions";
import { createBatch, updateBatch, deleteBatch } from "../api/batches";
import { listIngredients } from "../api/ingredients";

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
    const [loadingErrorIngredients, setLoadingErrorIngredients] = useState<string | null>(null);
    const [loadingErrorSession, setLoadingErrorSession] = useState<string | null>(null);
    const [isLoadingSession, setIsLoadingSession] = useState<boolean>(false);
    const [isLoadingIngredients, setIsLoadingIngredients] = useState<boolean>(false);
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

    return (
        <div>
            {submissionError && <p>{submissionError}</p>}
            {loadingErrorSession && <p>{loadingErrorSession}</p>}
            {isLoadingSession && <p>Loading prep session...</p>}
            {!isLoadingSession && !loadingErrorSession && prepSession && (
                <div>
                    <button type="button" onClick={onBack}>Back to prep sessions</button>
                    <h1>Prep Session: {prepSession.name}</h1>
                    <p className="page-lede">{prepSession.sessionDate}</p>
                    {prepSession.notes && <p>Notes: {prepSession.notes}</p>}
                    <button type="button" onClick={openAddBatchForm}>
                        Add batch
                    </button>

                    {isBatchFormOpen && (
                        <form onSubmit={handleSubmit}>
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
                                    <p>Raw: {batch.rawWeightG} g · Cooked: {batch.cookedWeightG} g</p>
                                    <p>Yield: {formatYield(batch)}</p>
                                    {batch.id !== undefined && (
                                        <div className="form-actions">
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