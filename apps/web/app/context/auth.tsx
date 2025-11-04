"use client";

import { createContext, useContext, useState, useEffect } from "react";

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
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem("jwt");
    if (token) {
      fetchUser(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  async function fetchUser(token: string) {
    try {
      const res = await fetch("http://localhost:1337/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const res = await fetch("http://localhost:1337/api/auth/local", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: email, password }),
    });

    if (!res.ok) throw new Error("Login failed");

    const data = await res.json();
    localStorage.setItem("jwt", data.jwt);
    setUser(data.user);
  }

  async function register(username: string, email: string, password: string) {
    const res = await fetch("http://localhost:1337/api/auth/local/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (!res.ok) throw new Error("Registration failed");

    const data = await res.json();
    localStorage.setItem("jwt", data.jwt);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("jwt");
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
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
