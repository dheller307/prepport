import { useState, useEffect } from 'react';
import { apiJson } from '../api/client';
import { PrepSession } from '../types/prepSession';
import { PortionCalculateRequest, PortionCalculateResponse } from '../types/portion';
import { calculatePortion, exportPortion } from '../api/portion';

export function PortionBuilder() {
    const [prepSessions, setPrepSessions] = useState<PrepSession[]>([]);
    const [prepSessionLoadingError, setPrepSessionLoadingError] = useState<string | null>(null);
    const [prepSessionIsLoading, setPrepSessionIsLoading] = useState<boolean>(false);
    const [lines, setLines] = useState<PortionCalculateRequest[]>([]);
    const [results, setResults] = useState<(PortionCalculateResponse | null)[]>([]);
    const [exportText, setExportText] = useState<string | null >(null);
    const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
    const [calculateError, setCalculateError] = useState<string | null>(null);
    const [isCalculating, setIsCalculating] = useState<boolean>(false);
    const [exportError, setExportError] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState<boolean>(false);

    useEffect(() => {
        async function loadPrepSessions() {
            setPrepSessionLoadingError(null);
            setPrepSessionIsLoading(true);
            try {
                const response = await apiJson<PrepSession[]>('/api/prep-sessions', { method: 'GET', auth: true });
                setPrepSessions(response);
            } catch (prepSessionLoadError) {
            setPrepSessionLoadingError(prepSessionLoadError instanceof Error ? prepSessionLoadError.message : 'Failed to load prep sessions');
            } finally {
                setPrepSessionIsLoading(false);
            }
        }
        loadPrepSessions();
    }, []);

    function handleAddLine() {
        setLines(prev => [...prev, { batchId: 0, cookedGrams: 0 }]);
        setResults(prev => [...prev, null]);
    }

    function handleRemoveLine(index: number) {
        setLines(prev => prev.filter((_, i) => i !== index));
        setResults(prev => prev.filter((_, i) => i !== index));
    }

    function updateLineBatch(index: number, batchId: number) {
        setLines(prev => prev.map((line, i) => i === index ? { ...line, batchId } : line));
        setResults(prev => prev.map((result, i) => i === index ? null : result));
    }

    function updateLineGrams(index: number, cookedGrams: number) {
        setLines(prev => prev.map((line, i) => i === index ? { ...line, cookedGrams } : line));
        setResults(prev => prev.map((result, i) => i === index ? null : result));
    }

    async function calculateLine(index: number) {
        setCalculateError(null);
        setIsCalculating(true);
        try {
            const response = await calculatePortion(lines[index]);
            setResults(prev => prev.map((result, i) => i === index ? response : result));
        } catch (calculateError) {
            setCalculateError(calculateError instanceof Error ? calculateError.message : 'Failed to calculate portion');
        } finally {
            setIsCalculating(false);
        }
    }

    function getValidLines() {
        return lines.filter((line) => line.batchId > 0 && line.cookedGrams > 0);
    }

    async function handleExport() {
        setExportError(null);
        setIsExporting(true);
        try {
            const response = await exportPortion({lines: getValidLines()});
            setExportText(response);
        } catch (exportError) {
            setExportError(exportError instanceof Error ? exportError.message : 'Failed to export portion');
            setExportText(null);
        } finally {
            setIsExporting(false);
        }
    }

    async function handleCopy() {
        navigator.clipboard.writeText(exportText ?? '').then(() => {
            setCopyFeedback('Copied to clipboard');
        }).catch(() => {
            setCopyFeedback('Failed to copy to clipboard');
        });
        setTimeout(() => {
            setCopyFeedback(null);
        }, 3000);
    }

    return (
        <div>
            <h1>Portion Builder</h1>
            {prepSessionLoadingError && <p>{prepSessionLoadingError}</p>}
            {prepSessionIsLoading && <p>Loading prep sessions...</p>}
            {!prepSessionIsLoading && !prepSessionLoadingError && prepSessions.length < 1 && (
                <p>Create a prep session with batches to build portions first</p>
            )}
            {!prepSessionIsLoading && !prepSessionLoadingError && (
            <>
                <section>
                    <h2>Portions</h2>
                    <button onClick={handleAddLine}>Add Line</button>
                    {lines.length < 1 && <p>No lines yet</p>}
                    {lines.length > 0 && (
                        <ul>
                            {lines.map((line, index) => (
                                <li key={index}>
                                    <select value={line.batchId || ''} onChange={(e) => updateLineBatch(index, Number(e.target.value))}>
                                        <option value="">Select a batch</option>
                                        {prepSessions.flatMap((session) => session.batches ?? []).map((batch) => (
                                            <option key={batch.id} value={batch.id}>{batch.ingredient.name} - {batch.createdAt?.split('T')[0]} - {batch.rawWeightG}g/{batch.cookedWeightG}g</option>
                                        ))}
                                    </select>
                                    <input type="number" value={line.cookedGrams} onChange={(e) => updateLineGrams(index, Number(e.target.value))} />
                                    <button onClick={() => calculateLine(index)}>Calculate</button>
                                    <button onClick={() => handleRemoveLine(index)}>Remove</button>
                                    {results[index] && <p>{results[index].cronometerG}g</p>}
                                    {results[index] && <p>P: {results[index].proteinG}g - F: {results[index].fatG}g - C: {results[index].carbsG}g - Cal: {results[index].kcal}kcal</p>}
                                </li>
                            ))}
                            {calculateError && <p>{calculateError}</p>}
                            {isCalculating && <p>Calculating...</p>}
                        </ul>
                    )}
                </section>
                <section>
                    <h2>Export</h2>
                    
                    <button onClick={handleExport} disabled={isExporting || getValidLines().length === 0}>{isExporting ? 'Exporting...' : 'Export'}</button>
                    {exportError && <p>{exportError}</p>}
                    {exportText && (
                        <>
                            <pre>{exportText}</pre>
                            <button onClick={handleCopy} disabled={!exportText}>Copy</button>
                            {copyFeedback && <p>{copyFeedback}</p>}
                        </>
                    )}
                </section>
            </>
            )}
        </div>
    );
}