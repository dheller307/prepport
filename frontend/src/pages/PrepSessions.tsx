import { CreatePrepSessionRequest, PrepSession } from "../types/prepSession";
import { useState, useEffect } from "react";
import { PrepSessionDetail } from "./PrepSessionDetail";
import {
  listPrepSessions,
  createPrepSession,
  updatePrepSession,
  deletePrepSession,
  getPrepSessionDeletionImpact,
} from "../api/prepSessions";

export function PrepSessions() {
  const [prepSessions, setPrepSessions] = useState<PrepSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(
    null,
  );
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingSession, setEditingSession] = useState<PrepSession | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  function getTodayLocalDateString(): string {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  }

  function emptyPrepSessionForm(): CreatePrepSessionRequest {
    return {
      name: "",
      sessionDate: getTodayLocalDateString(),
      notes: "",
    };
  }

  const [form, setForm] = useState<CreatePrepSessionRequest>(
    emptyPrepSessionForm(),
  );

  function openAddForm() {
    setEditingSession(null);
    setForm(emptyPrepSessionForm());
    setIsFormOpen(true);
  }

  function openEditForm(session: PrepSession) {
    setEditingSession(session);
    setForm({
      name: session.name,
      sessionDate: session.sessionDate,
      notes: session.notes ?? "",
    });
    setIsFormOpen(true);
  }

  async function loadPrepSessions() {
    setLoadingError(null);
    setIsLoading(true);
    try {
      const response = await listPrepSessions();
      setPrepSessions(response);
    } catch (error) {
      setLoadingError(
        error instanceof Error ? error.message : "Failed to load prep sessions",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPrepSessions();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmissionError(null);
    setIsSubmitting(true);
    try {
      const isEditing = editingSession?.id !== undefined;
      const response = isEditing
        ? await updatePrepSession(editingSession.id!, form)
        : await createPrepSession(form);
      if (isEditing) {
        setPrepSessions((current) =>
          current.map((session) =>
            session.id === editingSession.id ? response : session,
          ),
        );
      } else {
        setPrepSessions((current) => [...current, response]);
      }
      setEditingSession(null);
      setForm(emptyPrepSessionForm());
      setIsFormOpen(false);
    } catch (error) {
      setSubmissionError(
        error instanceof Error ? error.message : "Failed to save prep session",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  async function handleDelete(id: number) {
    setActionError(null);
    setIsDeleting(true);

    try {
      const impact = await getPrepSessionDeletionImpact(id);
      const mealWarning =
        impact.affectedMealCount === 0
          ? "This will permanently delete the prep session and its batches."
          : `This will permanently delete the prep session, its batches, and ${impact.affectedMealCount} saved meal${impact.affectedMealCount === 1 ? "" : "s"}.`;
      const crossSessionWarning = impact.hasCrossSessionMeals
        ? "\n\nSome affected meals also use batches from other prep sessions. Deleting this session will delete those entire meals. The other sessions, batches, and ingredients remain."
        : "";

      if (
        !window.confirm(`${mealWarning}${crossSessionWarning}\n\nContinue?`)
      ) {
        return;
      }

      await deletePrepSession(id, impact.affectedMealCount > 0);
      setPrepSessions((current) =>
        current.filter((session) => session.id !== id),
      );
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Failed to delete prep session",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  if (selectedSessionId !== null) {
    return (
      <PrepSessionDetail
        id={selectedSessionId}
        onBack={() => {
          setSelectedSessionId(null);
          void loadPrepSessions();
        }}
      />
    );
  }

  const sessionsNewestFirst = [...prepSessions].sort((first, second) =>
    second.sessionDate.localeCompare(first.sessionDate),
  );

  return (
    <div>
      <h1>Prep Sessions</h1>
      <p className="page-lede">
        Cook sessions and batches. Record raw and cooked weights so yields are
        calculated for you.
      </p>

      <button type="button" onClick={openAddForm}>
        New prep session
      </button>

      {isFormOpen && (
        <form className="entity-form" onSubmit={handleSubmit}>
          <h2>{editingSession ? "Edit prep session" : "New prep session"}</h2>
          <div className="form-field">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="sessionDate">Session Date</label>
            <input
              type="date"
              id="sessionDate"
              value={form.sessionDate}
              onChange={(e) =>
                setForm({ ...form, sessionDate: e.target.value })
              }
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          {submissionError && (
            <p className="form-error" role="alert">
              {submissionError}
            </p>
          )}
          <div className="form-actions">
            <button type="submit" disabled={isSubmitting || !form.name.trim()}>
              {isSubmitting
                ? "Saving..."
                : editingSession
                  ? "Save changes"
                  : "Add prep session"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingSession(null);
                setForm(emptyPrepSessionForm());
                setIsFormOpen(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {loadingError && (
        <p className="form-error" role="alert">
          {loadingError}
        </p>
      )}
      {isLoading && <p>Loading prep sessions...</p>}
      {!isLoading && !loadingError && prepSessions.length === 0 && (
        <p>No prep sessions yet.</p>
      )}
      {!isLoading && !loadingError && prepSessions.length > 0 && (
        <>
          {actionError && (
            <p className="form-error" role="alert">
              {actionError}
            </p>
          )}
          <ul className="card-list">
            {sessionsNewestFirst.map((prepSession) => (
              <li key={prepSession.id} className="card">
                <strong>{prepSession.name}</strong> — {prepSession.sessionDate}
                <p>{prepSession.batches?.length ?? 0} batches</p>
                {prepSession.notes && <p>Notes: {prepSession.notes}</p>}
                {prepSession.id !== undefined && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        if (prepSession.id !== undefined) {
                          setSelectedSessionId(prepSession.id);
                        }
                      }}
                    >
                      View batches
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditForm(prepSession)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (prepSession.id !== undefined) {
                          handleDelete(prepSession.id);
                        }
                      }}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
