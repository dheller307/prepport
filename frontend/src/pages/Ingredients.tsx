import { Ingredient } from "../types/ingredient";
import { useState, useEffect } from "react";
import { listIngredients } from "../api/ingredients";
import { apiJson } from "../api/client";

type IngredientForm = Omit<Ingredient, 'id' | 'createdAt'>

export function Ingredients() {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [loadingError, setLoadingError] = useState<string | null>(null);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    
    const [form, setForm] = useState<IngredientForm>({
        name: '',
        macroBasis: 'RAW',
        proteinPer100g: 0,
        carbsPer100g: 0,
        fatPer100g: 0,
        kcalPer100g: 0,
        notes: '',
    })

    useEffect(() => {
        async function loadIngredients() {
            setLoadingError(null);
            setIsLoading(true);
            try {
                const response = await listIngredients();
                setIngredients(response);
            } catch (error) {
                setLoadingError(error instanceof Error ? error.message : 'Failed to load ingredients');
            } finally {
                setIsLoading(false);
            }
        }
        loadIngredients();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmissionError(null);
        setIsSubmitting(true);
        try {
            const response = await apiJson<Ingredient>('/api/ingredients', {
                method: 'POST',
                body: form,
                auth: true,
            });
            setIngredients((prev) => [...prev, response]);
            setForm({
                name: '',
                macroBasis: 'RAW',
                proteinPer100g: 0,
                carbsPer100g: 0,
                fatPer100g: 0,
                kcalPer100g: 0,
                notes: '',
            });
        } catch (error) {
            setSubmissionError(error instanceof Error ? error.message : 'Failed to add ingredient');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div>
            <h1>Ingredients</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                    <label htmlFor="macroBasis">Macro Basis</label>
                    <select id="macroBasis" value={form.macroBasis} onChange={(e) => setForm({ ...form, macroBasis: e.target.value as 'RAW' | 'COOKED' })}>
                        <option value="RAW">RAW</option>
                        <option value="COOKED">COOKED</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="proteinPer100g">Protein per 100g</label>
                    <input type="number" id="proteinPer100g" step="0.1" value={form.proteinPer100g} onChange={(e) => setForm({ ...form, proteinPer100g: Number(e.target.value) })} />
                </div>
                <div>
                    <label htmlFor="carbsPer100g">Carbs per 100g</label>
                    <input type="number" id="carbsPer100g" step="0.1" value={form.carbsPer100g} onChange={(e) => setForm({ ...form, carbsPer100g: Number(e.target.value) })} />
                </div>
                <div>
                    <label htmlFor="fatPer100g">Fat per 100g</label>
                    <input type="number" id="fatPer100g" step="0.1" value={form.fatPer100g} onChange={(e) => setForm({ ...form, fatPer100g: Number(e.target.value) })} />
                </div>
                <div>
                    <label htmlFor="kcalPer100g">Kcal per 100g</label>
                    <input type="number" id="kcalPer100g" step="0.1" value={form.kcalPer100g} onChange={(e) => setForm({ ...form, kcalPer100g: Number(e.target.value) })} />
                </div>
                <div>
                    <label htmlFor="notes">Notes</label>
                    <textarea id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
                <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Adding...' : 'Add Ingredient'}</button>
            </form>
            {submissionError && <p>{submissionError}</p>}
            {loadingError && <p>{loadingError}</p>}
            {isLoading && <p>Loading ingredients...</p>}
            {!isLoading && !loadingError && ingredients.length === 0 && <p>No ingredients yet</p>}
            {!isLoading && !loadingError && ingredients.length > 0 && (
                <ul>
                    {ingredients.map((ingredient) => (
                        <li key={ingredient.id}>{ingredient.name}</li>
                    ))}
                </ul>
            )}
        </div>
    )
}