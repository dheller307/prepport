import { useState } from "react";
import { getToken } from "./auth/token";
import { LoginForm } from "./auth/Login";
import { RegisterForm } from "./auth/Register";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(getToken() !== null);

  if (!isLoggedIn) {
    return (
      <>
        <LoginForm onSuccess={() => setIsLoggedIn(true)} />
        <p>Don't have an account? <button onClick={() => setIsLoggedIn(false)}>Register</button></p>
      </>
    );
  }

  return (
    <main className="app">
      <h1>PrepPort</h1>
      <p>Slice 4 — ingredients + prep session</p>
    </main>
  )
}

export default App
