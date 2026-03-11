import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return children;
}