import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../services/auth.service";

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
      //token: null,
      //user: null,
      
      // Para pruebas, eliminar en producción
      token: "fake-token", 
 	    user: "null",
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