import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LanguageStore {
  selectedLanguageId: string | null;
  setSelectedLanguage: (id: string) => void;
  clearLanguage: () => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      selectedLanguageId: null,
      setSelectedLanguage: (id) => set({ selectedLanguageId: id }),
      clearLanguage: () => set({ selectedLanguageId: null }),
    }),
    {
      name: "language-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
