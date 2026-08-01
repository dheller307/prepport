import { getToken } from "./token";


type ProtectedRouteProps = {
    children: React.ReactNode;
    fallback: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
    if (!getToken()) {
        return fallback;
    }
    return <>{children}</>;
}