import { TutorialSteps } from "./TutorialSteps";

export function TutorialPage() {
  return (
    <section>
      <h1>Tutorial</h1>
      <p className="page-lede">
        A quick reference for the PrepPort workflow while you use the app.
      </p>
      <TutorialSteps />
    </section>
  );
}
