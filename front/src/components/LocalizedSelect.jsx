import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";

/**
 * A language-aware select component that adapts to the current language
 *
 * @param {Object} props - Component props
 * @param {string} props.label - Select label (translation key)
 * @param {string} props.value - Selected value
 * @param {function} props.onChange - Change handler
 * @param {Array} props.options - Array of options [{value, label, translationKey}]
 * @param {boolean} props.required - Whether the select is required
 * @param {string} props.name - Select name
 * @param {string} props.id - Select ID
 * @param {string} props.error - Error message
 * @param {Object} props.selectProps - Additional props for the select element
 * @param {Object} props.labelProps - Additional props for the label element
 * @param {string} props.className - Additional class names for the container
 */
const LocalizedSelect = ({
  label,
  value,
  onChange,
  options = [],
  required = false,
  name,
  id,
  error,
  selectProps = {},
  labelProps = {},
  className = "",
  ...rest
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  // Generate a unique ID if not provided
  const selectId =
    id || `select-${name || Math.random().toString(36).substr(2, 9)}`;

  // Determine text direction based on language
  const dir = isRTL() ? "rtl" : "ltr";

  // Determine font class based on language
  const fontClass = isRTL() ? "font-ar font-fa" : "";

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className={`block text-sm font-medium text-gray-700 mb-1 ${fontClass}`}
          {...labelProps}
        >
          {t(label)}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        dir={dir}
        className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        } ${fontClass}`}
        {...selectProps}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.translationKey ? t(option.translationKey) : option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className={`mt-1 text-sm text-red-500 ${fontClass}`}>
          {typeof error === "string" ? error : t(error)}
        </p>
      )}
    </div>
  );
};

export default LocalizedSelect;
