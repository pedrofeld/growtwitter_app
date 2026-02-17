import { Navigate } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { useAuth } from "../config/context/AuthContext";

export const LoginPage = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <LoginForm />;
};
