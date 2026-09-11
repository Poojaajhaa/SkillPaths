import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

type ProtectedRouteProps = {
    children: ReactNode;
    allowedRoles: string[];
};

function ProtectedRoute ({ children, allowedRoles } : ProtectedRouteProps) {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const role = storedUser ? JSON.parse(storedUser).role : null;

    if (!token) {
        return <Navigate 
           to="/login" replace/>
    }

    if(!allowedRoles.includes(role)) {
        return <Navigate
           to="/" replace />
    }
    return <>
      {children}
    </>
}

export default ProtectedRoute;