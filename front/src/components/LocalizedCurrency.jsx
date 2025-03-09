import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import { formatCurrency } from "../utils/formatters";

/**
 * A component that displays currency values in a localized format
 *
 * @param {Object} props - Component props
 * @param {number} props.value - The amount to format
 * @param {string} props.currency - Currency code (USD, EUR, etc.)
 * @param {string} props.className - Additional class names
 */
const LocalizedCurrency = ({
  value,
  currency = "USD",
  className = "",
  ...rest
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  if (value === undefined || value === null) {
    return <span className={className}>{t("common.na")}</span>;
  }

  // Determine font class based on language
  const fontClass = isRTL() ? "font-ar font-fa" : "";

  // Format the currency
  const formattedCurrency = formatCurrency(value, currency);

  return (
    <span className={`${fontClass} ${className}`} {...rest}>
      {formattedCurrency}
    </span>
  );
};

export default LocalizedCurrency;
