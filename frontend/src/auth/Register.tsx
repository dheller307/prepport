import { useState } from "react";
import { api } from "../api/client";
import { AuthResponse } from "../types/auth";
import { setToken } from "../auth/token";

type RegisterFormProps = {
    onSuccess: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const response = await api<AuthResponse>('/api/auth/register', {
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
            <button type="submit" disabled={isLoading}>{isLoading ? 'Registering...' : 'Register'}</button>
        </form>
    )
}