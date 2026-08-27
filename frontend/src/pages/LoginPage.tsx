import { Link, Navigate, useNavigate } from "react-router-dom";
import { LoginForm } from "../auth/Login";
import { getToken } from "../auth/token";
import { AuthLayout } from "../layout/AuthLayout";

export function LoginPage() {
  const navigate = useNavigate();

  if (getToken()) {
    return <Navigate to="/ingredients" replace />;
  }

  return (
    <AuthLayout title="Log in">
      <LoginForm onSuccess={() => navigate("/ingredients", { replace: true })} />
      <p>
        Don't have an account? <Link to="/register">Create account</Link>
      </p>
    </AuthLayout>
  );
}
