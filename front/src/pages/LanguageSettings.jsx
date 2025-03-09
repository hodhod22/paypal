import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";

const LanguageSettings = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, getLanguages } = useLanguage();

  // Get all languages with translated names
  const languages = getLanguages();

  // Flag icons for each language
  const flags = {
    en: "🇬🇧",
    fa: "🇮🇷",
    sv: "🇸🇪",
    ar: "🇸🇦",
    tr: "🇹🇷",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t("settings.language")}</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          {t("settings.selectLanguage")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`flex items-center p-4 border rounded-lg transition-colors ${
                lang.code === currentLanguage
                  ? "bg-blue-50 border-blue-500"
                  : "hover:bg-gray-50 border-gray-200"
              }`}
            >
              <span className="text-2xl mr-3">{flags[lang.code]}</span>
              <div className="flex flex-col items-start">
                <span className="font-medium">{lang.translatedName}</span>
                <span className="text-sm text-gray-500">{lang.nativeName}</span>
              </div>
              {lang.code === currentLanguage && (
                <span className="ml-auto bg-blue-500 text-white px-2 py-1 rounded text-xs">
                  {t("common.active")}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-md font-semibold mb-2">
            {t("settings.languageInfo")}
          </h3>
          <p className="text-gray-600">{t("settings.languageDescription")}</p>

          {currentLanguage === "ar" || currentLanguage === "fa" ? (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800">
                {t("settings.rtlSupport")}
              </h4>
              <p className="text-yellow-700 text-sm mt-1">
                {t("settings.rtlDescription")}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LanguageSettings;
