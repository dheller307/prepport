import { useState, useEffect } from "react";
import { PrepSession } from "../types/prepSession";
import { Batch, CreateBatchRequest } from "../types/batch";
import { Ingredient } from "../types/ingredient";
import { apiJson } from "../api/client";
import { listIngredients } from "../api/ingredients";

type PrepSessionDetailProps = {
    id: number;
    onBack: () => void;
}

export function PrepSessionDetail({ id, onBack }: PrepSessionDetailProps) {
    const [prepSession, setPrepSession] = useState<PrepSession | null>(null);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [loadingErrorIngredients, setLoadingErrorIngredients] = useState<string | null>(null);
    const [loadingErrorSession, setLoadingErrorSession] = useState<string | null>(null);
    const [isLoadingSession, setIsLoadingSession] = useState<boolean>(false);
    const [isLoadingIngredients, setIsLoadingIngredients] = useState<boolean>(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    
    const [form, setForm] = useState<CreateBatchRequest>({
        ingredientId: 0,
        rawWeightG: 0,
        cookedWeightG: 0,
    });

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
                const response = await apiJson<PrepSession>(`/api/prep-sessions/${id}`, {
                    method: 'GET',
                    auth: true,
                });
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
            const response = await apiJson<Batch>(`/api/prep-sessions/${id}/batches`, {
                method: 'POST',
                body: form,
                auth: true,
            });
            setPrepSession((prev) => prev ? { ...prev, batches: [...(prev.batches ?? []), response] } : prev);
            setForm({
                ingredientId: 0,
                rawWeightG: 0,
                cookedWeightG: 0,
            });
        } catch (error) {
            setSubmissionError(error instanceof Error ? error.message : 'Failed to create batch');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div>
            <h1>Prep Session Details</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="ingredientId">Ingredient</label>
                    {loadingErrorIngredients && <p>{loadingErrorIngredients}</p>}
                    <select id="ingredientId" value={form.ingredientId || ''} disabled={isLoadingIngredients || !!loadingErrorIngredients} onChange={(e) => setForm({ ...form, ingredientId: Number(e.target.value) })}>
                        <option value="" disabled>{isLoadingIngredients ? 'Loading ingredients...' : 'Select an ingredient'}</option>
                        {ingredients.map((ingredient) => (
                            <option key={ingredient.id} value={ingredient.id}>{ingredient.name}</option>
                        ))}
                    </select>
                    <label htmlFor="rawWeightG">Raw Weight (g)</label>
                    <input type="number" id="rawWeightG" value={form.rawWeightG} onChange={(e) => setForm({ ...form, rawWeightG: Number(e.target.value) })} />
                    <label htmlFor="cookedWeightG">Cooked Weight (g)</label>
                    <input type="number" id="cookedWeightG" value={form.cookedWeightG} onChange={(e) => setForm({ ...form, cookedWeightG: Number(e.target.value) })} />
                </div>
                <button type="submit" disabled={isSubmitting || isLoadingSession|| isLoadingIngredients|| !!loadingErrorIngredients|| !!loadingErrorSession|| !prepSession ||!form.ingredientId || !form.rawWeightG || !form.cookedWeightG}>{isSubmitting ? 'Adding...' : 'Add Batch'}</button>
            </form>
            {submissionError && <p>{submissionError}</p>}
            <button onClick={onBack}>Back</button>
            {loadingErrorSession && <p>{loadingErrorSession}</p>}
            {isLoadingSession && <p>Loading prep session...</p>}
            {!isLoadingSession && !loadingErrorSession && prepSession && (
                <div>
                    <h2>{prepSession.sessionDate}</h2>
                    {prepSession.notes && <p>Notes: {prepSession.notes}</p>}
                    {!prepSession.batches?.length ? (
                        <p>No batches yet</p>
                    ) : (
                        <ul>
                            {prepSession.batches?.map((batch) => (
                                <li key={batch.id}>
                                    {batch.ingredient.name} - {batch.rawWeightG}g raw - {batch.cookedWeightG}g cooked
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    )
}