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
            Cooking changes food weight, and batches of the same ingredient can
            yield different cooked weights. PrepPort uses the raw and cooked
            weights you record for each batch to calculate nutrition for the
            portions you eat.
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
