import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../../models/user";
import axios from "axios";

interface AuthContextType {
  user: User | null; // Loged user data (or null if not loged)
  isAuthenticated: boolean;
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Axios interceptor add the JWT token to the Authorization header of
 * each/every request if the user is logged in
 *
 * This way, we don't have to manually add the token to each request we
 * make to the backend
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  /**
   * Login function:
   * 1. Makes POST request to /login with email and password
   * 2. Backend returns { token: "jwt...", user: { id, username, ... } }
   * 3. Saves user in state (allows rest of app to know we're logged in)
   * 4. Saves token in localStorage (persists session across reloads)
   * 5. Interceptor automatically adds this token to future requests
   */
  const login = async (login: string, password: string) => {
    // Backend layer
    try {
      const response = await api.post("/login", {
        login,
        password,
      });

      const { token, user: userData } = response.data;

      // Save user data in state (isAuthenticated becomes true)
      setUser(userData);

      // Save token in localStorage for future requests
      localStorage.setItem("authToken", token);
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  /**
   * Logout function
   * 1. Removes user from state (isAuthenticated becomes false)
   * 2. Remove token from localStorage
   * 3. ProtectedRoute will automatically redirect to /login
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to acess auth context values and functions easily in any component
 * Example of usage:
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth need to be used inside an AuthProvider");
  }
  return context;
};
