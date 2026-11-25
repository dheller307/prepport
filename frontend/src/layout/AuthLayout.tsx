import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { AppPreviewLink } from "./AppPreviewLink";

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
          <p className="page-lede">
            <strong>Meal prep, measured accurately.</strong>
          </p>
          <p className="page-lede">
            Track cooking yields, build meals from prepared batches, and
            calculate nutrition using your actual raw and cooked weights.
          </p>
          <nav className="auth-links" aria-label="Learn about PrepPort">
            <AppPreviewLink />
            <Link to="/">How it works</Link>
          </nav>
          <h1>{title}</h1>
        </header>
        {children}
      </div>
    </main>
  );
}
