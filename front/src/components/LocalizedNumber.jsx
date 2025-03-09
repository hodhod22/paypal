import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import { formatNumber } from "../utils/formatters";

/**
 * A component that displays numbers in a localized format
 *
 * @param {Object} props - Component props
 * @param {number} props.value - The number to format
 * @param {Object} props.options - Intl.NumberFormat options
 * @param {string} props.className - Additional class names
 */
const LocalizedNumber = ({ value, options = {}, className = "", ...rest }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  if (value === undefined || value === null) {
    return <span className={className}>{t("common.na")}</span>;
  }

  // Determine font class based on language
  const fontClass = isRTL() ? "font-ar font-fa" : "";

  // Format the number
  const formattedNumber = formatNumber(value, options);

  return (
    <span className={`${fontClass} ${className}`} {...rest}>
      {formattedNumber}
    </span>
  );
};

export default LocalizedNumber;
