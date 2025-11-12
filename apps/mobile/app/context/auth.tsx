import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    checkExistingToken();
  }, []);

  async function checkExistingToken() {
    try {
      const token = await AsyncStorage.getItem("jwt");
      if (token) {
        await fetchUser(token);
      }
    } catch (error) {
      console.error("Failed to check token:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchUser(token: string) {
    try {
      const res = await fetch("http://localhost:1337/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        // Token is invalid, clear it
        await AsyncStorage.removeItem("jwt");
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  }

  async function login(email: string, password: string) {
    const res = await fetch("http://localhost:1337/api/auth/local", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error?.message || "Login failed");
    }

    const data = await res.json();
    await AsyncStorage.setItem("jwt", data.jwt);
    setUser(data.user);
  }

  async function register(username: string, email: string, password: string) {
    const res = await fetch("http://localhost:1337/api/auth/local/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error?.message || "Registration failed");
    }

    const data = await res.json();
    await AsyncStorage.setItem("jwt", data.jwt);
    setUser(data.user);
  }

  async function logout() {
    await AsyncStorage.removeItem("jwt");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
