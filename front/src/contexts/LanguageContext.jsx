import React, { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// Create the context
const LanguageContext = createContext();

// Languages supported by the application
const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", dir: "ltr", nativeName: "English" },
  { code: "fa", name: "Persian", dir: "rtl", nativeName: "فارسی" },
  { code: "sv", name: "Swedish", dir: "ltr", nativeName: "Svenska" },
  { code: "ar", name: "Arabic", dir: "rtl", nativeName: "العربية" },
  { code: "tr", name: "Turkish", dir: "ltr", nativeName: "Türkçe" },
];

// Language codes for easier access
const LANGUAGE_CODES = SUPPORTED_LANGUAGES.map((lang) => lang.code);

// Provider component
export const LanguageProvider = ({ children }) => {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || "en");

  // Update the language in the state when i18n language changes
  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  // Change the language
  const changeLanguage = (code) => {
    console.log("Changing language to:", code);
    const language = SUPPORTED_LANGUAGES.find((lang) => lang.code === code);

    if (language) {
      try {
        // Change the language in i18next
        i18n.changeLanguage(code);

        // Update the document language and direction
        document.documentElement.lang = code;
        document.documentElement.dir = language.dir;

        // Add RTL class if needed
        if (language.dir === "rtl") {
          document.documentElement.classList.add("rtl");
          document.body.classList.add("rtl");
        } else {
          document.documentElement.classList.remove("rtl");
          document.body.classList.remove("rtl");
        }

        // Store the language preference
        localStorage.setItem("i18nextLng", code);

        // Update the state
        setCurrentLanguage(code);

        console.log("Language changed successfully to:", code);

        // Don't reload the page as it causes logout
        // Instead, dispatch a custom event that components can listen for
        const event = new CustomEvent("languageChanged", {
          detail: { language: code },
        });
        document.dispatchEvent(event);
      } catch (error) {
        console.error("Error changing language:", error);
      }
    } else {
      console.error("Language not supported:", code);
    }
  };

  // Get the current language object
  const getCurrentLanguage = () => {
    return (
      SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLanguage) ||
      SUPPORTED_LANGUAGES[0]
    );
  };

  // Check if the current language is RTL
  const isRTL = () => {
    const lang = getCurrentLanguage();
    return lang.dir === "rtl";
  };

  // Get all supported languages with translated names
  const getLanguages = () => {
    return SUPPORTED_LANGUAGES.map((lang) => ({
      ...lang,
      translatedName: t(`languages.${lang.code}`),
    }));
  };

  // The context value
  const value = {
    currentLanguage,
    languages: SUPPORTED_LANGUAGES,
    availableLanguages: LANGUAGE_CODES,
    changeLanguage,
    getCurrentLanguage,
    isRTL,
    getLanguages,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
};

export default LanguageContext;
