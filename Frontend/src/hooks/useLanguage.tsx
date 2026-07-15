import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { en, nl, LocaleKey, Translations } from "@/translations";

interface LanguageContextType {
  locale: LocaleKey;
  setLocale: (locale: LocaleKey) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to load saved locale from localStorage
  const savedLocale = localStorage.getItem("TESSERON_language") as LocaleKey;
  const initialLocale: LocaleKey = savedLocale === "en" || savedLocale === "nl" ? savedLocale : "en";
  
  const [locale, setLocaleState] = useState<LocaleKey>(initialLocale);

  const setLocale = useCallback((newLocale: LocaleKey) => {
    setLocaleState(newLocale);
    localStorage.setItem("TESSERON_language", newLocale);
  }, []);

  const translations = locale === "nl" ? nl : en;

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};


