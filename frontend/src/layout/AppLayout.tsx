import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearToken } from "../auth/token";

export function AppLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    clearToken();
    navigate("/login", { replace: true });
  }

  return (
    <div className="app">
      <header className="app-header">
        <p className="app-title">PrepPort</p>
        <nav className="app-nav">
          <NavLink to="/ingredients">Ingredients</NavLink>
          <NavLink to="/prep">Prep</NavLink>
          <NavLink to="/portion">Portion</NavLink>
          <NavLink to="/tutorial">Tutorial</NavLink>
        </nav>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <Outlet />
    </div>
  );
}
