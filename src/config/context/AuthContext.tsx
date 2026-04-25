/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../../models/user";
import { api } from "../services/api.service";
import {
  clearAuthSession,
  persistAuthSession,
  normalizeTokenValue,
  readAuthSession,
  type StoredAuthSession,
} from "../services/authSession.service";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updater: (currentUser: User | null) => User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<StoredAuthSession | null>(() => readAuthSession({
    clearInvalid: true,
  }));

  useEffect(() => {
    if (!session) {
      clearAuthSession();
      return;
    }

    const timeoutInMs = session.expiresAt - Date.now();

    if (timeoutInMs <= 0) {
      clearAuthSession();
      setSession(null);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      clearAuthSession();
      setSession(null);
    }, timeoutInMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [session]);

  const user = session?.user ?? null;

  const login = async (login: string, password: string) => {
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

      setSession(persistAuthSession(userData, token));
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const logout = useCallback(() => {
    clearAuthSession();
    setSession(null);
  }, []);

  const updateUser = useCallback((updater: (currentUser: User | null) => User | null) => {
    setSession((currentSession) => {
      if (!currentSession) {
        return null;
      }

      const updatedUser = updater(currentSession.user);

      if (!updatedUser) {
        clearAuthSession();
        return null;
      }

      return persistAuthSession(updatedUser, currentSession.token, currentSession.expiresAt);
    });
  }, []);

  const isAuthenticated = !!session && session.expiresAt > Date.now();

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, updateUser }}
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
