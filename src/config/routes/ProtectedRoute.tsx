import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

// It (children) is necessary in routes.tsx
interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Objetive: ensure that only authenticated users can access certain routes.
 * 1. User tries to access a protected route (example: "/feed")
 * 2. ProtectedRoute checks if isAuthenticated === true
 * 3. If NOT authenticated, user is redirected to "/login"
 * 4. If IS authenticated, user can see the page normally
 *
 * Example of usage in routes.tsx:
 * {}
 *   path: "/",
 *   element: (
 *     <ProtectedRoute>
 *       <DefaultLayout />
 *     </ProtectedRoute>
 *   ),
 *   children: [...]
 * }
 */

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
