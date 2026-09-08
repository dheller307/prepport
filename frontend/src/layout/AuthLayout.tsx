import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type AuthLayoutProps = {
  title: string;
  children: ReactNode;
};

export function AuthLayout({ title, children }: AuthLayoutProps) {
  return (
    <main className="app">
      <div className="auth-card">
        <header className="auth-header">
          <p className="app-title">PrepPort</p>
          <p className="page-lede">Companion for meal prep</p>
          <p className="page-lede">
            Build meals from prepared batches and copy nutrition details for any
            tracker.
          </p>
          <p className="hint">
            <Link to="/">Tutorial</Link>
          </p>
          <h1>{title}</h1>
        </header>
        {children}
      </div>
    </main>
  );
}
