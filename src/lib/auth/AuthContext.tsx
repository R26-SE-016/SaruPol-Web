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

export type StoredUserRecord = User & { password?: string };

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
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: () => Promise<boolean>;
}

const STORAGE_KEYS = {
  TOKEN: "sarupol_auth_token",
  USER: "sarupol_auth_user",
  REGISTERED_USERS: "sarupol_registered_users",
};

// Fixed CRI Research Trial Stations (Reserved exclusively for CRI Research Officers)
export const CRI_FIXED_ESTATES = [
  "Makandura Experimental Estate (Intermediate Zone)",
  "Lunuwila CRI Headquarters (Wet Zone)",
  "Puttalam Seed Garden (Dry Zone)",
  "Ratnapura High-Rainfall Estate (Wet Zone)",
  "Batticaloa Coastal Research Station (Dry Zone)",
];

// Commercial Plantations and Private Holdings (For Planters & Estate Managers)
export const COMMERCIAL_ESTATES = [
  "Kurunegala Commercial Block (Intermediate Zone)",
  "Gampaha / Negombo Smallholding (Wet Zone)",
  "Chilaw Coconut Holding (Intermediate Zone)",
  "Kuliyapitiya Commercial Plantation (Intermediate Zone)",
  "Madampe Coconut Grove (Intermediate Zone)",
  "Puttalam Commercial Holding (Dry Zone)",
  "Kalutara Coastal Smallholding (Wet Zone)",
  "Other / Private Coconut Plantation",
];

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

/**
 * Safely retrieve all registered accounts from local persistence.
 */
function getRegisteredUsers(): StoredUserRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
    if (!stored) {
      // Seed initial demo accounts
      const initialSeed: StoredUserRecord[] = [
        { ...DEMO_ACCOUNTS.agronomist.user, password: DEMO_ACCOUNTS.agronomist.password },
        { ...DEMO_ACCOUNTS.planter.user, password: DEMO_ACCOUNTS.planter.password },
      ];
      localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(initialSeed));
      return initialSeed;
    }
    return JSON.parse(stored);
  } catch (e) {
    console.warn("Failed to load registered users directory:", e);
    return [];
  }
}

/**
 * Persist or update a user account in the registered users directory.
 */
function saveRegisteredUser(record: StoredUserRecord): void {
  if (typeof window === "undefined") return;
  try {
    const list = getRegisteredUsers();
    const cleanEmail = record.email.trim().toLowerCase();
    const idx = list.findIndex((u) => u.email.trim().toLowerCase() === cleanEmail);

    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        ...record,
        email: cleanEmail,
        // Preserve password if not supplied in update
        password: record.password || list[idx].password,
      };
    } else {
      list.push({ ...record, email: cleanEmail });
    }

    localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(list));
  } catch (e) {
    console.warn("Failed to save registered user record:", e);
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore authenticated session from localStorage on initial boot
  useEffect(() => {
    try {
      // Ensure demo seed accounts exist in directory
      getRegisteredUsers();

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

    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (pass || "").trim();

    if (!cleanEmail || !cleanPassword) {
      setIsLoading(false);
      return { success: false, error: "Please enter both email address and password." };
    }

    // 1. Check Demo Accounts (Fast Path)
    if (cleanEmail === DEMO_ACCOUNTS.agronomist.email.toLowerCase()) {
      if (cleanPassword === DEMO_ACCOUNTS.agronomist.password) {
        const demoUser = DEMO_ACCOUNTS.agronomist.user;
        const demoToken = "jwt_mock_token_agronomist_2026";
        setToken(demoToken);
        setUser(demoUser);
        localStorage.setItem(STORAGE_KEYS.TOKEN, demoToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(demoUser));
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: "Incorrect password for CRI Research Officer account." };
      }
    }

    if (cleanEmail === DEMO_ACCOUNTS.planter.email.toLowerCase()) {
      if (cleanPassword === DEMO_ACCOUNTS.planter.password) {
        const demoUser = DEMO_ACCOUNTS.planter.user;
        const demoToken = "jwt_mock_token_planter_2026";
        setToken(demoToken);
        setUser(demoUser);
        localStorage.setItem(STORAGE_KEYS.TOKEN, demoToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(demoUser));
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: "Incorrect password for Commercial Planter account." };
      }
    }

    // 2. Try real SaruPol-Gateway backend API
    try {
      const res = await authApi.login(cleanEmail, cleanPassword);
      if (res && res.token && res.user) {
        const u: StoredUserRecord = {
          id: res.user.id,
          name: res.user.name,
          email: res.user.email.trim().toLowerCase(),
          role: (res.user.role as any) || "planter",
          estate_id: res.user.estate_id || COMMERCIAL_ESTATES[0],
          phone: res.user.phone || "+94 77 123 4567",
          created_at: res.user.created_at || new Date().toISOString().split("T")[0],
          password: cleanPassword,
        };

        // Cache locally for seamless offline resilience
        saveRegisteredUser(u);

        setToken(res.token);
        setUser(u);
        localStorage.setItem(STORAGE_KEYS.TOKEN, res.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(u));
        setIsLoading(false);
        return { success: true };
      }
    } catch (err: any) {
      console.warn("[Auth] Gateway login offline/fallback:", err.message);
    }

    // 3. Fallback to Local Registered Users Directory
    const registeredList = getRegisteredUsers();
    const foundUser = registeredList.find((u) => u.email.trim().toLowerCase() === cleanEmail);

    if (foundUser) {
      // Check password matching
      if (!foundUser.password || foundUser.password === cleanPassword) {
        // If user didn't have password saved previously, save it now
        if (!foundUser.password) {
          foundUser.password = cleanPassword;
          saveRegisteredUser(foundUser);
        }

        const fallbackToken = `jwt_mock_${foundUser.id}_${Date.now()}`;
        setToken(fallbackToken);
        setUser(foundUser);
        localStorage.setItem(STORAGE_KEYS.TOKEN, fallbackToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(foundUser));
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: "Incorrect password. Please verify and try again." };
      }
    }

    setIsLoading(false);
    return {
      success: false,
      error: "No registered account found with this email. Please register first.",
    };
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

    const cleanEmail = (data.email || "").trim().toLowerCase();
    const cleanPassword = (data.password || "").trim();
    const newId = `usr_${Date.now().toString(36)}`;
    const defaultEstate =
      data.estate_id ||
      (data.role === "officer" ? CRI_FIXED_ESTATES[0] : COMMERCIAL_ESTATES[0]);

    const newUser: StoredUserRecord = {
      id: newId,
      name: data.name.trim(),
      email: cleanEmail,
      role: data.role || "planter",
      estate_id: defaultEstate,
      phone: data.phone?.trim() || "+94 77 123 4567",
      district: data.district || "Kurunegala",
      created_at: new Date().toISOString().split("T")[0],
      password: cleanPassword, // Always store credentials locally
    };

    // 1. Always immediately persist to local registered directory
    saveRegisteredUser(newUser);

    let activeToken = `jwt_mock_${newId}`;

    // 2. Try registering on Gateway API
    try {
      const res = await authApi.register({
        name: data.name.trim(),
        email: cleanEmail,
        password: cleanPassword,
        role: data.role,
        estate_id: defaultEstate,
        phone: data.phone,
        district: data.district,
      });

      if (res && res.token && res.user) {
        activeToken = res.token;
        if (res.user.id) {
          newUser.id = res.user.id;
          saveRegisteredUser(newUser);
        }
      }
    } catch (err: any) {
      console.warn("[Auth] Gateway registration offline/saving locally:", err.message);
    }

    // 3. Set active authenticated session
    setToken(activeToken);
    setUser(newUser);
    localStorage.setItem(STORAGE_KEYS.TOKEN, activeToken);
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

    // Update in registered directory as well
    saveRegisteredUser(updatedUser as StoredUserRecord);
    return true;
  };

  const changePassword = async (oldPass: string, newPass: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "User not authenticated." };
    if (!newPass || newPass.length < 6) {
      return { success: false, error: "New password must be at least 6 characters long." };
    }

    try {
      const list = getRegisteredUsers();
      const cleanEmail = user.email.trim().toLowerCase();
      const idx = list.findIndex((u) => u.email.trim().toLowerCase() === cleanEmail);

      if (idx !== -1) {
        list[idx].password = newPass.trim();
        localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(list));
      }

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to update password." };
    }
  };

  const deleteAccount = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      // Clean up from registered users list
      const list = getRegisteredUsers();
      const cleanEmail = user.email.trim().toLowerCase();
      const filtered = list.filter((u) => u.email.trim().toLowerCase() !== cleanEmail);
      localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(filtered));

      // Clear sessions, tokens, and active logs
      logout();
      return true;
    } catch (e) {
      console.warn("Account deletion failed:", e);
      return false;
    }
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
        changePassword,
        deleteAccount,
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
