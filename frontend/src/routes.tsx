import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { AppLayout } from "./layout/AppLayout";
import { Ingredients } from "./pages/Ingredients";
import { LoginPage } from "./pages/LoginPage";
import { PortionBuilder } from "./pages/PortionBuilder";
import { PrepSessions } from "./pages/PrepSessions";
import { RegisterPage } from "./pages/RegisterPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/ingredients" replace />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/prep" element={<PrepSessions />} />
          <Route path="/portion" element={<PortionBuilder />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
