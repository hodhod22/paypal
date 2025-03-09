import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";

/**
 * A language-aware error message component that adapts to the current language
 *
 * @param {Object} props - Component props
 * @param {string} props.message - Error message (translation key or direct message)
 * @param {string} props.variant - Error variant (error, warning, info)
 * @param {boolean} props.dismissible - Whether the error can be dismissed
 * @param {function} props.onDismiss - Dismiss handler
 * @param {string} props.className - Additional class names
 */
const LocalizedErrorMessage = ({
  message,
  variant = "error",
  dismissible = false,
  onDismiss,
  className = "",
  ...rest
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  if (!message) return null;

  // Determine font class based on language
  const fontClass = isRTL() ? "font-ar font-fa" : "";

  // Determine variant class
  const variantClasses = {
    error: "bg-red-100 border-red-400 text-red-700",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
    info: "bg-blue-100 border-blue-400 text-blue-700",
    success: "bg-green-100 border-green-400 text-green-700",
  };

  // Determine if the message is a translation key
  const isTranslationKey =
    typeof message === "string" &&
    message.includes(".") &&
    !message.includes(" ") &&
    message.length < 50;

  // Format the message
  const formattedMessage = isTranslationKey ? t(message) : message;

  return (
    <div
      className={`p-3 border rounded relative ${
        variantClasses[variant] || variantClasses.error
      } ${fontClass} ${className}`}
      role="alert"
      {...rest}
    >
      {dismissible && (
        <button
          type="button"
          className="absolute top-0 right-0 p-1 m-1 text-gray-500 hover:text-gray-700"
          onClick={onDismiss}
          aria-label={t("common.dismiss")}
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
      <div className={dismissible ? "pr-6" : ""}>{formattedMessage}</div>
    </div>
  );
};

export default LocalizedErrorMessage;
