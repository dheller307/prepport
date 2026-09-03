import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { AppLayout } from "./layout/AppLayout";
import { Ingredients } from "./pages/Ingredients";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { LoginPage } from "./pages/LoginPage";
import { PortionBuilder } from "./pages/PortionBuilder";
import { PrepSessions } from "./pages/PrepSessions";
import { RegisterPage } from "./pages/RegisterPage";
import { TutorialPage } from "./pages/TutorialPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HowItWorksPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/how-it-works" element={<Navigate to="/" replace />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/prep" element={<PrepSessions />} />
          <Route path="/portion" element={<PortionBuilder />} />
          <Route path="/tutorial" element={<TutorialPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
