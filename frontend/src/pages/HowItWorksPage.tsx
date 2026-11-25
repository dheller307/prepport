import { Link } from "react-router-dom";
import { AppPreviewLink } from "../layout/AppPreviewLink";

export function HowItWorksPage() {
  return (
    <main className="app">
      <section className="auth-card public-intro-card">
        <header className="auth-header">
          <p className="app-title">PrepPort</p>
          <h1>How PrepPort Works</h1>
          <p className="page-lede">
            Cooking changes food weight, so a generic cooked-food entry may
            assume a different yield than your batch. PrepPort uses the raw and
            cooked weights you measure to calculate nutrition for your portions.
          </p>
        </header>

        <section aria-labelledby="chicken-example">
          <h2 id="chicken-example">Chicken example</h2>
          <dl className="yield-example">
            <dt>500 g raw</dt>
            <dd>
              <span aria-hidden="true">→</span>
              <span>
                <strong>400 g cooked</strong> (80% yield)
              </span>
            </dd>
            <dt>150 g cooked serving</dt>
            <dd>
              <span aria-hidden="true">→</span>
              <strong>187.5 g raw equivalent</strong>
            </dd>
          </dl>
          <p className="hint">
            Use the raw equivalent for raw-food nutrition entries.
          </p>
        </section>

        <p>
          <strong>
            Add&nbsp;ingredients → Record&nbsp;batches → Build&nbsp;meals
          </strong>
        </p>

        <nav className="auth-links" aria-label="Explore PrepPort">
          <AppPreviewLink />
          <span>
            <span className="intro-link-separator" aria-hidden="true">
              ·
            </span>
            <Link to="/register">Create account</Link>
          </span>
          <span>
            <span className="intro-link-separator" aria-hidden="true">
              ·
            </span>
            <Link to="/login">Log in</Link>
          </span>
        </nav>
        <p className="hint">Four screenshots showing PrepPort in use.</p>
      </section>
    </main>
  );
}
