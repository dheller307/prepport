import { useRef, useState } from "react";
import { apiJson } from "../api/client";
import { AuthResponse } from "../types/auth";
import { setToken } from "../auth/token";
import { AuthSubmit } from "./AuthSubmit";

type RegisterFormProps = {
  onSuccess: () => void;
};

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const requestPending = useRef(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (requestPending.current) return;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    requestPending.current = true;
    setError(null);
    setIsLoading(true);
    try {
      const response = await apiJson<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: { email, password },
        auth: false,
      });
      setToken(response.token);
      onSuccess();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      requestPending.current = false;
      setIsLoading(false);
    }
  };
  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-field">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="form-field">
        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          type="password"
          id="confirm-password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <p className="hint">
          At least 8 characters with uppercase, lowercase, number, and special
          character.
        </p>
      </div>
      <AuthSubmit
        label="Register"
        pendingLabel="Registering..."
        isLoading={isLoading}
      />
    </form>
  );
}
