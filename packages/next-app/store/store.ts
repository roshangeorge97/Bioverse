import { create } from "zustand";

interface Store {
  username: string;
  setUsername: (username: string) => void;
}

export const useStore = create<Store>((set) => ({
  username: "",
  setUsername: (username) => set({ username }),
}));
