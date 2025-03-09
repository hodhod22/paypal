import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";

const LanguageIndicator = ({ position = "bottom-right", showRtl = true }) => {
  const { t } = useTranslation();
  const { getCurrentLanguage, isRTL } = useLanguage();

  const currentLang = getCurrentLanguage();
  const rtl = isRTL();

  const positionClasses = {
    "top-left": "top-2 left-2",
    "top-right": "top-2 right-2",
    "bottom-left": "bottom-2 left-2",
    "bottom-right": "bottom-2 right-2",
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 flex items-center space-x-2`}
    >
      <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-70 hover:opacity-100 transition-opacity">
        <span className="font-medium">{t(`languages.${currentLang}`)}</span>
        {showRtl && rtl && (
          <span className="ml-1 text-yellow-300 text-xs">(RTL)</span>
        )}
      </div>
    </div>
  );
};

export default LanguageIndicator;
