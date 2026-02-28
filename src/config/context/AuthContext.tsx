/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../../models/user";
import { api } from "../services/api.service";

function normalizeTokenValue(rawToken: unknown): string | null {
  if (!rawToken) return null;

  if (typeof rawToken === "object") {
    const tokenFromObject = (rawToken as { token?: string; accessToken?: string }).token
      || (rawToken as { token?: string; accessToken?: string }).accessToken;
    return normalizeTokenValue(tokenFromObject);
  }

  if (typeof rawToken !== "string") return null;

  const trimmedValue = rawToken.trim().replace(/^"|"$/g, "");
  const normalizedToken = trimmedValue.replace(/^Bearer\s+/i, "").trim();

  return normalizedToken || null;
}

function isJwtExpired(token: string): boolean {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return false;

    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64)) as { exp?: number };

    if (!payload.exp) return false;

    return Date.now() >= payload.exp * 1000;
  } catch {
    return false;
  }
}

interface AuthContextType {
  user: User | null; // Loged user data (or null if not loged)
  isAuthenticated: boolean;
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  
  // Initialize user state from localStorage (if there's a saved user)
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("authUser");
    const storedToken = normalizeTokenValue(localStorage.getItem("authToken"));

    if (!storedToken || isJwtExpired(storedToken)) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      return null;
    }

    if (!savedUser) {
      localStorage.removeItem("authToken");
      return null;
    }

    try {
      return JSON.parse(savedUser) as User;
    } catch {
      localStorage.removeItem("authUser");
      localStorage.removeItem("authToken");
      return null;
    }
  });

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

      const responseData = response.data;
      const token = normalizeTokenValue(
        responseData?.token
          ?? responseData?.data?.token
          ?? responseData?.accessToken
          ?? responseData?.data?.accessToken,
      );
      const userData = responseData?.user ?? responseData?.data?.user;

      if (!token) {
        throw new Error("Invalid login response: missing token");
      }

      if (!userData) {
        throw new Error("Invalid login response: missing user data");
      }

      // Save user data in state (isAuthenticated becomes true)
      setUser(userData);
      localStorage.setItem("authUser", JSON.stringify(userData));

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
    localStorage.removeItem("authUser");
  };

  const token = localStorage.getItem("authToken");
  const normalizedToken = normalizeTokenValue(token);
  const isAuthenticated = !!user && !!normalizedToken && !isJwtExpired(normalizedToken);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout }}
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
