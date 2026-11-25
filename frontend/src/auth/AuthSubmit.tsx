type AuthSubmitProps = {
  label: string;
  pendingLabel: string;
  isLoading: boolean;
};

export function AuthSubmit({
  label,
  pendingLabel,
  isLoading,
}: AuthSubmitProps) {
  return (
    <>
      <button type="submit" disabled={isLoading}>
        {isLoading ? pendingLabel : label}
      </button>
      <div className="auth-status" role="status">
        {isLoading && (
          <>
            <span className="auth-spinner" aria-hidden="true" />
            <span>
              Connecting to the demo server. Free hosting may take up to a
              minute to start after inactivity.
            </span>
          </>
        )}
      </div>
    </>
  );
}
