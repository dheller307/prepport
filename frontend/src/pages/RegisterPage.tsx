import { Link, Navigate, useNavigate } from "react-router-dom";
import { RegisterForm } from "../auth/Register";
import { getToken } from "../auth/token";
import { AuthLayout } from "../layout/AuthLayout";

export function RegisterPage() {
  const navigate = useNavigate();

  if (getToken()) {
    return <Navigate to="/ingredients" replace />;
  }

  return (
    <AuthLayout title="Create account">
      <RegisterForm onSuccess={() => navigate("/ingredients", { replace: true })} />
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </AuthLayout>
  );
}
