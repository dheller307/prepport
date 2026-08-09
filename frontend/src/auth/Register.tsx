import { useState } from "react";
import { apiJson } from "../api/client";
import { AuthResponse } from "../types/auth";
import { setToken } from "../auth/token";

type RegisterFormProps = {
    onSuccess: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        if (password !== confirmPassword) {
            setIsLoading(false);
            setError('Passwords do not match');
            return;
        }
        try {
            const response = await apiJson<AuthResponse>('/api/auth/register', {
                method: 'POST',
                body: { email, password },
                auth: false,
            });
            setToken(response.token);
            onSuccess();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            {error && <p>{error}</p>}
            <div>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
                <label htmlFor="confirm-password">Confirm Password</label>
                <input type="password" id="confirm-password" autoComplete="new-password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <p className="hint">At least 8 characters with uppercase, lowercase, number, and special character.</p>
            </div>
            <button type="submit" disabled={isLoading}>{isLoading ? 'Registering...' : 'Register'}</button>
        </form>
    )
}