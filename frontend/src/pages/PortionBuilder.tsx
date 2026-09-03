import { useState, useEffect, useRef } from 'react';
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

    const validLines = getValidLines();

    async function handleExport() {
        setExportError(null);
        setIsExporting(true);
        try {
            const response = await exportPortion({lines: validLines});
            setExportText(response);
        } catch (exportError) {
            setExportError(exportError instanceof Error ? exportError.message : 'Failed to export portion');
            setExportText(null);
        } finally {
            setIsExporting(false);
        }
    }

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(exportText ?? '');
            setCopyFeedback('Copied to clipboard');
        } catch (copyError) {
            setCopyFeedback('Failed to copy to clipboard');
        } finally {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            timerRef.current = setTimeout(() => {
                setCopyFeedback(null);
            }, 3000);
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
            <h1>Portion Builder</h1>
            <p className="page-lede">
              Build portions from any prep session's batches. Get macros and raw-equivalent grams for your tracker.
            </p>
            {prepSessionLoadingError && <p>{prepSessionLoadingError}</p>}
            {prepSessionIsLoading && <p>Loading prep sessions...</p>}
            {!prepSessionIsLoading && !prepSessionLoadingError && prepSessions.length === 0 && (
                <p>No prep sessions found. Create a prep session first.</p>
            )}
            {!prepSessionIsLoading && !prepSessionLoadingError && prepSessions.length > 0 && batches.length < 1 && (
                <p>No batches found for any prep session. Create a batch first.</p>
            )}
            {!prepSessionIsLoading && !prepSessionLoadingError && prepSessions.length > 0 && batches.length > 0 && (
            <>
                <section>
                    <h2>Portions</h2>
                    <button onClick={handleAddLine}>Add Line</button>
                    {lines.length < 1 && <p>No lines yet</p>}
                    {lines.length > 0 && (
                        <ul>
                            {lines.map((line, index) => (
                                <li key={index} className='portion-line'>
                                    <select value={line.batchId || ''} onChange={(e) => updateLineBatch(index, Number(e.target.value))}>
                                        <option value="">Select a batch</option>
                                        {batches.map((batch) => (
                                            <option key={batch.id} value={batch.id}>{batch.ingredient.name} - {batch.createdAt?.split('T')[0]} - {batch.rawWeightG}g/{batch.cookedWeightG}g</option>
                                        ))}
                                    </select>
                                    <input type="number" value={line.cookedGrams === 0 ? '' : line.cookedGrams} onChange={(e) => updateLineGrams(index, Number(e.target.value))} />
                                    <div className='portion-line-actions'>
                                        <button onClick={() => calculateLine(index)} disabled={isCalculating}>{isCalculating ? 'Calculating...' : 'Calculate'}</button>
                                        <button onClick={() => handleRemoveLine(index)}>Remove</button>
                                    </div>
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
                    <button onClick={handleExport} disabled={isExporting || validLines.length === 0}>{isExporting ? 'Exporting...' : 'Export'}</button>
                    {exportError && <p>{exportError}</p>}
                    {exportText && (
                        <>
                            <pre className='export-pre'>{exportText}</pre>
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