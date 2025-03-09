import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";

/**
 * A language-aware input component that adapts to the current language
 *
 * @param {Object} props - Component props
 * @param {string} props.type - Input type (text, email, number, etc.)
 * @param {string} props.label - Input label (translation key)
 * @param {string} props.placeholder - Placeholder text (translation key)
 * @param {string} props.value - Input value
 * @param {function} props.onChange - Change handler
 * @param {boolean} props.required - Whether the input is required
 * @param {string} props.name - Input name
 * @param {string} props.id - Input ID
 * @param {string} props.error - Error message
 * @param {Object} props.inputProps - Additional props for the input element
 * @param {Object} props.labelProps - Additional props for the label element
 * @param {string} props.className - Additional class names for the container
 */
const LocalizedInput = ({
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  required = false,
  name,
  id,
  error,
  inputProps = {},
  labelProps = {},
  className = "",
  ...rest
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  // Generate a unique ID if not provided
  const inputId =
    id || `input-${name || Math.random().toString(36).substr(2, 9)}`;

  // Determine text direction based on language
  const dir = isRTL() ? "rtl" : "ltr";

  // Determine font class based on language
  const fontClass = isRTL() ? "font-ar font-fa" : "";

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`block text-sm font-medium text-gray-700 mb-1 ${fontClass}`}
          {...labelProps}
        >
          {t(label)}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        type={type}
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder ? t(placeholder) : ""}
        required={required}
        dir={dir}
        className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        } ${fontClass}`}
        {...inputProps}
        {...rest}
      />

      {error && (
        <p className={`mt-1 text-sm text-red-500 ${fontClass}`}>
          {typeof error === "string" ? error : t(error)}
        </p>
      )}
    </div>
  );
};

export default LocalizedInput;
