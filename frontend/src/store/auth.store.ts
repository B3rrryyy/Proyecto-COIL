import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../services/auth.service";
import type { LoginPayload } from "../services/auth.service";
const API_URL = import.meta.env.VITE_API_URL;

export const login = async (data: LoginPayload) => {
  const res = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      // Para pruebas, eliminar en producción
      //token: "fake-token", 
 	    //user: "null",
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
