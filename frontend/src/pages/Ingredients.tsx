import { Ingredient, IngredientForm } from "../types/ingredient";
import { useState, useEffect } from "react";
import { listIngredients, updateIngredient, createIngredient, deleteIngredient } from "../api/ingredients";

export function Ingredients() {

    const emptyIngredientForm: IngredientForm = {
        name: '',
        macroBasis: 'RAW',
        proteinPer100g: 0,
        carbsPer100g: 0,
        fatPer100g: 0,
        kcalPer100g: 0,
        notes: '',
    };

    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [loadingError, setLoadingError] = useState<string | null>(null);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
    
    const [form, setForm] = useState<IngredientForm>(emptyIngredientForm);

    function openAddForm() {
        setEditingIngredient(null);
        setForm(emptyIngredientForm);
        setIsFormOpen(true);
    }

    function openEditForm(ingredient: Ingredient) {
        setEditingIngredient(ingredient);
        setForm({
            name: ingredient.name,
            macroBasis: ingredient.macroBasis,
            proteinPer100g: ingredient.proteinPer100g,
            carbsPer100g: ingredient.carbsPer100g,
            fatPer100g: ingredient.fatPer100g,
            kcalPer100g: ingredient.kcalPer100g,
            notes: ingredient.notes ?? '',
        });
        setIsFormOpen(true);
    }

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
            const isEditing = editingIngredient?.id !== undefined;
            const response = isEditing ? await updateIngredient(editingIngredient.id!, form) : await createIngredient(form);
            if (isEditing) {
                setIngredients((current) => current.map((ingredient) => ingredient.id === editingIngredient.id ? response : ingredient));
            } else {
                setIngredients((current) => [...current, response]);
            }
            setForm(emptyIngredientForm);
            setEditingIngredient(null);
            setIsFormOpen(false);
        } catch (error) {
            setSubmissionError(error instanceof Error ? error.message : 'Failed to save ingredient');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete(id: number) {
        if (!window.confirm('Are you sure you want to delete this ingredient?')) {
            return;
        }

        setIsDeleting(true);
        try {
            await deleteIngredient(id);
            setIngredients((current) => current.filter((ingredient) => ingredient.id !== id));
        } catch (error) {
            setLoadingError(error instanceof Error ? error.message : 'Failed to delete ingredient');
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div>
            <h1>Ingredients</h1>
            <p className="page-lede">
                Foods you prep with. Enter macros per 100 g from your tracker.
            </p>

            <button type="button" onClick={openAddForm}>
                Add ingredient
            </button>

            {isFormOpen && (
                <form onSubmit={handleSubmit}>
                    <h2>{editingIngredient ? 'Edit ingredient' : 'Add ingredient'}</h2>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="macroBasis">Macros copied from</label>
                        <select id="macroBasis" value={form.macroBasis} onChange={(e) => setForm({ ...form, macroBasis: e.target.value as 'RAW' | 'COOKED' })}>
                            <option value="RAW">Raw food entry</option>
                            <option value="COOKED">Cooked food entry</option>
                        </select>
                        <p className="hint">
                            Use raw unless you copied numbers from a cooked food or a package label. Batches still need raw and cooked weights for yield.
                        </p>
                    </div>
                    <div>
                        <label htmlFor="proteinPer100g">Protein per 100g</label>
                        <input type="number" id="proteinPer100g" step="0.1" value={form.proteinPer100g === 0 ? '' : form.proteinPer100g} onChange={(e) => setForm({ ...form, proteinPer100g: Number(e.target.value) })} />
                    </div>
                    <div>
                        <label htmlFor="carbsPer100g">Carbs per 100g</label>
                        <input type="number" id="carbsPer100g" step="0.1" value={form.carbsPer100g === 0 ? '' : form.carbsPer100g} onChange={(e) => setForm({ ...form, carbsPer100g: Number(e.target.value) })} />
                    </div>
                    <div>
                        <label htmlFor="fatPer100g">Fat per 100g</label>
                        <input type="number" id="fatPer100g" step="0.1" value={form.fatPer100g === 0 ? '' : form.fatPer100g} onChange={(e) => setForm({ ...form, fatPer100g: Number(e.target.value) })} />
                    </div>
                    <div>
                        <label htmlFor="kcalPer100g">Kcal per 100g</label>
                        <input type="number" id="kcalPer100g" step="0.1" value={form.kcalPer100g === 0 ? '' : form.kcalPer100g} onChange={(e) => setForm({ ...form, kcalPer100g: Number(e.target.value) })} />
                    </div>
                    <div>
                        <label htmlFor="notes">Notes</label>
                        <textarea id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                    </div>
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : editingIngredient ? 'Save changes' : 'Add ingredient'}
                    </button>
                    <button type="button" onClick={() => {
                        setForm(emptyIngredientForm);
                        setEditingIngredient(null);
                        setIsFormOpen(false);
                    }}>
                        Cancel
                    </button>
                </form>
            )}
            {submissionError && <p>{submissionError}</p>}
            {loadingError && <p>{loadingError}</p>}
            {isLoading && <p>Loading ingredients...</p>}
            {!isLoading && !loadingError && ingredients.length === 0 && <p>No ingredients yet. Add your first meal-prep food above.</p>}
            {!isLoading && !loadingError && ingredients.length > 0 && (
                <ul>
                    {ingredients.map((ingredient) => (
                        <li key={ingredient.id}>
                            <details>
                                <summary>
                                    {ingredient.name} · {ingredient.macroBasis.toLowerCase()} basis
                                </summary>
                                <p>
                                    Protein: {ingredient.proteinPer100g} g · Carbs: {ingredient.carbsPer100g} g · Fat: {ingredient.fatPer100g} g · {ingredient.kcalPer100g} kcal per 100 g
                                </p>
                                {ingredient.notes && <p>Notes: {ingredient.notes}</p>}
                                {ingredient.id !== undefined && (
                                    <>
                                        <button type="button" onClick={() => openEditForm(ingredient)}>
                                            Edit
                                        </button>
                                        <button type="button" onClick={() => {
                                            if (ingredient.id !== undefined) {
                                                handleDelete(ingredient.id);
                                            }
                                        }} disabled={isDeleting}>
                                            {isDeleting ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </>
                                )}
                            </details>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}