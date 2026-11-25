import { Link } from "react-router-dom";
import { AppPreviewLink } from "../layout/AppPreviewLink";

export function HowItWorksPage() {
  return (
    <main className="app">
      <section className="auth-card">
        <header className="auth-header">
          <p className="app-title">PrepPort</p>
          <h1>How PrepPort Works</h1>
          <p className="page-lede">
            <strong>Meal prep, measured accurately.</strong>
            <br />
            Cooking changes food weight, and generic cooked-food entries can
            assume a different yield. PrepPort uses your batch’s measured yield
            to calculate nutrition for your portions.
          </p>
        </header>

        <section aria-labelledby="chicken-example">
          <h2 id="chicken-example">Chicken example</h2>
          <dl className="batch-stats">
            <div>
              <dt>Raw batch</dt>
              <dd>500 g</dd>
            </div>
            <div>
              <dt>After cooking</dt>
              <dd>400 g</dd>
            </div>
            <div>
              <dt>Cooked serving</dt>
              <dd>150 g</dd>
            </div>
            <div>
              <dt>Raw equivalent</dt>
              <dd>187.5 g</dd>
            </div>
          </dl>
          <p className="hint">
            Use this amount with raw-food nutrition values.
          </p>
        </section>

        <section aria-labelledby="workflow">
          <h2 id="workflow">How it works</h2>
          <ol>
            <li>
              <strong>Define ingredients.</strong> Save nutrition per 100 g.
            </li>
            <li>
              <strong>Record batches.</strong> Track cooking yields and
              available food.
            </li>
            <li>
              <strong>Build meals.</strong> Calculate nutrition, save meals, or
              copy tracker-ready values.
            </li>
          </ol>
        </section>

        <nav className="auth-links" aria-label="Explore PrepPort">
          <AppPreviewLink />
          <Link to="/register">Create an account</Link>
          <Link to="/login">Log in</Link>
        </nav>
      </section>
    </main>
  );
}
