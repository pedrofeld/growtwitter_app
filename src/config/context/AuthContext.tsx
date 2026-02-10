import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../../models/user";

interface AuthContextType {
  user: User | null; // Loged user data (or null if not loged)
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // State that save loged user data
  // If null = without user loged
  // If it was an object User = someone is loged
  const [user, setUser] = useState<User | null>(null);

  /**
   * Login function:
   * 1. Sends email and password to backend
   * 2. Receives a JWT token (for future protected requests)
   * 3. Receives user data
   * 4. Saves user in state (setUser)
   * 5. Saves token in localStorage (for persistence between reloads)
   */
  const login = async (email: string, password: string) => {
    try {
      // Backend layer
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      // Save user data in state (this will make isAuthenticated = true)
      setUser(data.user);

      // Save token
      localStorage.setItem("authToken", data.token);
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  /**
   * Logout function:
   * 1. Removes user from state (back to null)
   * 2. Removes token from localStorage
   * 3. Components using useAuth() will detect there's no more user
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
 * Custom hook to acess auth context values and functions easily in any component.
 * Example of usage:
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};
