import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translations
import en from "./locales/en/translation.json";
import fa from "./locales/fa/translation.json";
import sv from "./locales/sv/translation.json";
import ar from "./locales/ar/translation.json";
import tr from "./locales/tr/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fa: { translation: fa },
      sv: { translation: sv },
      ar: { translation: ar },
      tr: { translation: tr },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "fa", "sv", "ar", "tr"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;
