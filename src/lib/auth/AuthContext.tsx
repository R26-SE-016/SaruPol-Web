"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { auth as authApi } from "@/lib/api";

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: "planter" | "manager" | "officer" | "user";
  estate_id?: string;
  phone?: string;
  district?: string;
  avatarUrl?: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role?: "planter" | "manager" | "officer" | "user";
    estate_id?: string;
    phone?: string;
    district?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => Promise<boolean>;
}

const STORAGE_KEYS = {
  TOKEN: "sarupol_auth_token",
  USER: "sarupol_auth_user",
};

// Built-in Demo Accounts for instant research validation
export const DEMO_ACCOUNTS = {
  agronomist: {
    email: "agronomist@cri.lk",
    password: "Password123!",
    user: {
      id: "usr_cri_001",
      name: "Dr. Priyantha Jayalath",
      email: "agronomist@cri.lk",
      role: "officer" as const,
      estate_id: "Lunuwila CRI Headquarters",
      phone: "+94 77 345 6789",
      district: "Kurunegala",
      created_at: "2026-01-15",
    },
  },
  planter: {
    email: "planter@sarupol.lk",
    password: "Password123!",
    user: {
      id: "usr_plt_042",
      name: "Sunil Wickramasinghe",
      email: "planter@sarupol.lk",
      role: "planter" as const,
      estate_id: "Makandura Experimental Estate",
      phone: "+94 71 890 1234",
      district: "Gampaha",
      created_at: "2026-03-10",
    },
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore authenticated session from localStorage on initial boot
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.warn("Failed to restore auth session:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      // 1. Try real SaruPol-Gateway backend API
      const res = await authApi.login(email, pass);
      if (res && res.token && res.user) {
        const u: User = {
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          role: (res.user.role as any) || "user",
          estate_id: res.user.estate_id || "Makandura",
          phone: res.user.phone || "+94 77 123 4567",
          created_at: res.user.created_at || new Date().toISOString().split("T")[0],
        };
        setToken(res.token);
        setUser(u);
        localStorage.setItem(STORAGE_KEYS.TOKEN, res.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(u));
        setIsLoading(false);
        return { success: true };
      }
    } catch (err: any) {
      // Check if matches demo accounts or standalone fallback
      const normalizedEmail = email.toLowerCase().trim();
      if (normalizedEmail === DEMO_ACCOUNTS.agronomist.email.toLowerCase()) {
        const demoUser = DEMO_ACCOUNTS.agronomist.user;
        const demoToken = "jwt_mock_token_agronomist_2026";
        setToken(demoToken);
        setUser(demoUser);
        localStorage.setItem(STORAGE_KEYS.TOKEN, demoToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(demoUser));
        setIsLoading(false);
        return { success: true };
      }

      if (normalizedEmail === DEMO_ACCOUNTS.planter.email.toLowerCase()) {
        const demoUser = DEMO_ACCOUNTS.planter.user;
        const demoToken = "jwt_mock_token_planter_2026";
        setToken(demoToken);
        setUser(demoUser);
        localStorage.setItem(STORAGE_KEYS.TOKEN, demoToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(demoUser));
        setIsLoading(false);
        return { success: true };
      }

      // If user previously registered in local storage
      try {
        const localRegistered = localStorage.getItem("sarupol_registered_users");
        if (localRegistered) {
          const registeredList: (User & { password?: string })[] = JSON.parse(localRegistered);
          const found = registeredList.find((u) => u.email.toLowerCase() === normalizedEmail);
          if (found) {
            const fallbackToken = `jwt_mock_${found.id}_${Date.now()}`;
            setToken(fallbackToken);
            setUser(found);
            localStorage.setItem(STORAGE_KEYS.TOKEN, fallbackToken);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(found));
            setIsLoading(false);
            return { success: true };
          }
        }
      } catch (e) {
        console.warn("Local registered lookup failed:", e);
      }
    }

    setIsLoading(false);
    return { success: false, error: "Invalid email or password." };
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    role?: "planter" | "manager" | "officer" | "user";
    estate_id?: string;
    phone?: string;
    district?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      // 1. Try real Gateway backend API
      const res = await authApi.register(data);
      if (res && res.token && res.user) {
        const u: User = {
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          role: (res.user.role as any) || data.role || "planter",
          estate_id: data.estate_id || "Makandura",
          phone: data.phone || "+94 77 123 4567",
          district: data.district || "Kurunegala",
          created_at: new Date().toISOString().split("T")[0],
        };
        setToken(res.token);
        setUser(u);
        localStorage.setItem(STORAGE_KEYS.TOKEN, res.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(u));
        setIsLoading(false);
        return { success: true };
      }
    } catch (err: any) {
      console.warn("Gateway registration offline, saving locally:", err.message);
    }

    // High-fidelity fallback registration
    const newId = `usr_${Date.now().toString(36)}`;
    const newUser: User = {
      id: newId,
      name: data.name,
      email: data.email,
      role: data.role || "planter",
      estate_id: data.estate_id || "Makandura Experimental Estate",
      phone: data.phone || "+94 77 123 4567",
      district: data.district || "Kurunegala",
      created_at: new Date().toISOString().split("T")[0],
    };

    const tokenGenerated = `jwt_mock_${newId}`;

    // Store in local user directory
    try {
      const localRegistered = localStorage.getItem("sarupol_registered_users");
      const list = localRegistered ? JSON.parse(localRegistered) : [];
      list.push(newUser);
      localStorage.setItem("sarupol_registered_users", JSON.stringify(list));
    } catch (e) {
      console.warn("Failed to append local user list:", e);
    }

    setToken(tokenGenerated);
    setUser(newUser);
    localStorage.setItem(STORAGE_KEYS.TOKEN, tokenGenerated);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));

    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const updateProfile = async (patch: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    const updatedUser = { ...user, ...patch };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
