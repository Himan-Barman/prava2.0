import { create } from "zustand";
import { api } from "../../../shared/api/client";

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: (token, user) => {
    localStorage.setItem("accessToken", token);
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      // Ignore error
    }
    localStorage.removeItem("accessToken");
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No token");

      // Verify token with backend
      const { data } = await api.get("/auth/me");
      set({ user: data.user, isAuthenticated: true });
    } catch (error) {
      set({ user: null, isAuthenticated: false });
      localStorage.removeItem("accessToken");
    } finally {
      set({ isLoading: false });
    }
  },
}));