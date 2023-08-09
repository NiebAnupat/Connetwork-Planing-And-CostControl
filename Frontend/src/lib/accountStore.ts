import { create } from "zustand";
import { setCookie } from "nookies";

// The interface for the account store
interface AccountStore {
  isAccount: "/Account";
  logout: () => void;
}

// Create the account store
export const useAccountStore = create<AccountStore>((set) => ({
  isAccount: "/Account",
  logout: () => {
    setCookie(null, "token", "", { maxAge: -1, path: "/" });
  },
}));
