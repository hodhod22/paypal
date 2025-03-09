import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";

const EnhancedLanguageSwitcher = ({
  variant = "dropdown",
  showFlags = true,
  isDarkMode = true,
  compact = false,
  onLanguageChange = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { availableLanguages, currentLanguage, changeLanguage, isRTL } =
    useLanguage();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => setIsOpen(false);

  // Handle language change
  const handleLanguageChange = (code) => {
    console.log("Language button clicked:", code);
    changeLanguage(code);
    closeDropdown();
    if (onLanguageChange) {
      onLanguageChange(code);
    }
  };

  // Get flag for a language
  const getFlag = (code) => {
    const flags = {
      en: "🇬🇧",
      sv: "🇸🇪",
      fa: "🇮🇷",
      ar: "🇸🇦",
      tr: "🇹🇷",
    };
    return flags[code] || code.toUpperCase();
  };

  // Get language name
  const getLanguageName = (code) => {
    const names = {
      en: "English",
      sv: "Svenska",
      fa: "فارسی",
      ar: "العربية",
      tr: "Türkçe",
    };
    return names[code] || code.toUpperCase();
  };

  // Ensure availableLanguages is an array
  const languages = Array.isArray(availableLanguages)
    ? availableLanguages
    : ["en", "sv", "fa", "ar", "tr"];

  console.log("Current language:", currentLanguage);
  console.log("Available languages:", languages);

  // Render as buttons
  if (variant === "buttons") {
    return (
      <div className="flex flex-wrap gap-2 language-buttons-container">
        {languages.map((lang) => {
          const isActive = currentLanguage === lang;
          return (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`language-button px-3 py-2 rounded transition-colors ${
                isActive
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              aria-selected={isActive}
              aria-label={`Switch to ${getLanguageName(lang)}`}
            >
              <span className="mr-2 text-lg">{getFlag(lang)}</span>
              {!compact && (
                <span className="font-medium">{getLanguageName(lang)}</span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Render as dropdown
  return (
    <div ref={dropdownRef} className="relative language-dropdown-container">
      <button
        onClick={toggleDropdown}
        className="flex items-center px-3 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors language-dropdown-button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className={`text-lg ${isRTL() ? "ml-2" : "mr-2"}`}>
          {getFlag(currentLanguage)}
        </span>
        {!compact && (
          <span className="font-medium">
            {getLanguageName(currentLanguage)}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute mt-2 language-dropdown bg-white rounded shadow-lg z-50 min-w-[150px] border border-gray-300"
          style={{ [isRTL() ? "right" : "left"]: 0 }}
          role="menu"
          aria-orientation="vertical"
        >
          {languages.map((lang) => {
            const isActive = currentLanguage === lang;
            return (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`w-full text-left px-4 py-2 transition-colors language-option ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "text-gray-800 hover:bg-gray-100"
                }`}
                aria-selected={isActive}
                role="menuitem"
              >
                <span className={`text-lg ${isRTL() ? "ml-2" : "mr-2"}`}>
                  {getFlag(lang)}
                </span>
                <span className="font-medium">{getLanguageName(lang)}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EnhancedLanguageSwitcher;
