import { Link } from "react-router-dom";
import { TutorialSteps } from "./TutorialSteps";

export function HowItWorksPage() {
  return (
    <main className="app">
      <section className="auth-card">
        <header className="auth-header">
          <p className="app-title">PrepPort</p>
          <h1>Tutorial</h1>
          <p className="page-lede">
            PrepPort helps you turn cooked meal-prep portions back into the
            raw-equivalent amounts nutrition trackers use.
          </p>
        </header>

        <TutorialSteps />

        <p>
          <Link to="/register">Create an account</Link> or{" "}
          <Link to="/login">log in</Link>.
        </p>
      </section>
    </main>
  );
}
