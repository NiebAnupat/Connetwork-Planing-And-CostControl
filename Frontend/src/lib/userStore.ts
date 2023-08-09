import User from "../models/User";
import { create } from "zustand";
import { setCookie } from "nookies";

interface UserStore {
  user: User | null;
  isLogout: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLogout: false,
  setUser: (newUser: User) => {
    set({ user: newUser });
  },
  logout: () => {
    set({ isLogout: false, user: null });
    setCookie(null, "token", "", { maxAge: -1, path: "/" });
  },
}));
