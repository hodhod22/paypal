import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * Custom hook to detect and set the user's language
 * @param {Object} options - Configuration options
 * @param {boolean} options.detectOnce - Whether to detect the language only once (default: true)
 * @param {boolean} options.respectUserPreference - Whether to respect the user's saved preference (default: true)
 * @returns {Object} - The i18n instance and current language
 */
const useLanguageDetection = (options = {}) => {
  const { detectOnce = true, respectUserPreference = true } = options;
  const { i18n } = useTranslation();

  useEffect(() => {
    // Check if we should detect the language
    const shouldDetect =
      !detectOnce || !localStorage.getItem("languageDetected");

    // If user has a saved preference and we should respect it, use that
    const savedLanguage = localStorage.getItem("i18nextLng");
    if (respectUserPreference && savedLanguage) {
      setLanguage(savedLanguage);
      return;
    }

    // Otherwise, detect the language
    if (shouldDetect) {
      detectAndSetLanguage();
      if (detectOnce) {
        localStorage.setItem("languageDetected", "true");
      }
    }
  }, [detectOnce, respectUserPreference, i18n]);

  /**
   * Detect the user's language and set it
   */
  const detectAndSetLanguage = () => {
    // Get browser language (e.g., 'en-US', 'fa', 'sv-SE')
    const browserLang = navigator.language || navigator.userLanguage;

    // Extract the language code (e.g., 'en', 'fa', 'sv')
    const langCode = browserLang.split("-")[0];

    // Check if the language is supported
    const supportedLanguages = ["en", "fa", "sv", "ar", "tr"];
    const detectedLang = supportedLanguages.includes(langCode)
      ? langCode
      : "en";

    // Set the language
    setLanguage(detectedLang);
  };

  /**
   * Set the language and update the document attributes
   * @param {string} langCode - The language code to set
   */
  const setLanguage = (langCode) => {
    // Set the language in i18next
    i18n.changeLanguage(langCode);

    // Set the document language attribute
    document.documentElement.lang = langCode;

    // Set the document direction attribute
    const isRTL = langCode === "ar" || langCode === "fa";
    document.documentElement.dir = isRTL ? "rtl" : "ltr";

    // Add a class to the body for language-specific styling
    document.body.className = document.body.className
      .replace(/\blang-\w+\b/g, "")
      .trim();
    document.body.classList.add(`lang-${langCode}`);
  };

  return {
    i18n,
    currentLanguage: i18n.language,
    setLanguage,
  };
};

export default useLanguageDetection;
