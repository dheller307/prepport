import { CreatePrepSessionRequest, PrepSession } from "../types/prepSession"
import { useState, useEffect } from "react"
import { api } from "../api/client"
import { PrepSessionDetail } from "./PrepSessionDetail";

export function PrepSessions() {
    const [prepSessions, setPrepSessions] = useState<PrepSession[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
    const [loadingError, setLoadingError] = useState<string | null>(null);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    
    function getTodayLocalDateString(): string {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    }
    
    const [form, setForm] = useState<CreatePrepSessionRequest>({
        sessionDate: getTodayLocalDateString(),
        notes: '',
    });

    useEffect(() => {
        async function loadPrepSessions() {
            setLoadingError(null);
            setIsLoading(true);
            try {
                const response = await api<PrepSession[]>('/api/prep-sessions', {
                    method: 'GET',
                    auth: true,
                });
                setPrepSessions(response);
            } catch (error) {
                setLoadingError(error instanceof Error ? error.message : 'Failed to load prep sessions');
            } finally {
                setIsLoading(false);
            }
        }
        loadPrepSessions();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmissionError(null);
        setIsSubmitting(true);
        try {
            const response = await api<PrepSession>('/api/prep-sessions', {
                method: 'POST',
                body: form,
                auth: true,
            });
            setPrepSessions((prev) => [...prev, response]);
            setForm({
                sessionDate: getTodayLocalDateString(),
                notes: '',
            });
        } catch (error) {
            setSubmissionError(error instanceof Error ? error.message : 'Failed to add prep session');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div>
            <h1>Prep Sessions</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="sessionDate">Session Date</label>
                    <input type="date" id="sessionDate" value={form.sessionDate} onChange={(e) => setForm({ ...form, sessionDate: e.target.value })} />
                </div>
                <div>
                    <label htmlFor="notes">Notes</label>
                    <textarea id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
                <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Add Prep Session'}</button>
            </form>
            {submissionError && <p>{submissionError}</p>}
            {loadingError && <p>{loadingError}</p>}
            {isLoading && <p>Loading prep sessions...</p>}
            {!isLoading && !loadingError && prepSessions.length === 0 && <p>No prep sessions yet</p>}
            {selectedSessionId !== null && <PrepSessionDetail id={selectedSessionId} onBack={() => setSelectedSessionId(null)} />}
            {!isLoading && !loadingError && prepSessions.length > 0 && selectedSessionId === null && (
                <ul>
                    {prepSessions.map((prepSession) => (
                        <li key={prepSession.id}>
                            {prepSession.sessionDate}
                            {prepSession.notes ? ` - ${prepSession.notes}` : ''}
                            {prepSession.batches?.length ? ` - (${prepSession.batches.length} batches)` : ''}
                            <button onClick={() => setSelectedSessionId(prepSession.id ?? null)}>View</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}