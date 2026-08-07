import { useState } from "react";
import { clearToken, getToken } from "./auth/token";
import { LoginForm } from "./auth/Login";
import { RegisterForm } from "./auth/Register";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { Ingredients } from "./pages/Ingredients";
import { PrepSessions } from "./pages/PrepSessions";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(getToken() !== null);
  const [authView, setAuthView] = useState<"login" | "register">("login");
  const handleLogout = () => {
    setIsLoggedIn(false);
    clearToken();
  }

  return (
    <ProtectedRoute
      fallback={
        <main className="app">
            {authView === "login" ? (
              <>
                <LoginForm onSuccess={() => setIsLoggedIn(true)} />
                <p>
                  Don't have an account?{" "}
                  <button type="button" onClick={() => setAuthView("register")}>
                    Register
                  </button>
                </p>
              </>
            ) : (
              <>
                <RegisterForm onSuccess={() => setIsLoggedIn(true)} />
                <p>
                  Already have an account?{" "}
                  <button type="button" onClick={() => setAuthView("login")}>
                    Login
                  </button>
                </p>
              </>
            )}
          </main>
        }
      >
        <main className="app">
          <h1>PrepPort</h1>
          <p>Slice 4 — ingredients + prep session</p>
          <button onClick={handleLogout}>Logout</button>
          <Ingredients />
          <PrepSessions />
        </main>
      </ProtectedRoute>
  );
}

export default App;
