import React from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";

/**
 * A language-aware button component that adapts to the current language
 *
 * @param {Object} props - Component props
 * @param {string} props.text - Button text (translation key)
 * @param {string} props.variant - Button variant (primary, secondary, danger, success, warning)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {boolean} props.isLoading - Whether the button is in loading state
 * @param {string} props.loadingText - Loading text (translation key)
 * @param {function} props.onClick - Click handler
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {string} props.className - Additional class names
 * @param {React.ReactNode} props.leftIcon - Icon to display on the left
 * @param {React.ReactNode} props.rightIcon - Icon to display on the right
 */
const LocalizedButton = ({
  text,
  variant = "primary",
  size = "md",
  disabled = false,
  isLoading = false,
  loadingText,
  onClick,
  type = "button",
  className = "",
  leftIcon,
  rightIcon,
  children,
  ...rest
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  // Determine font class based on language
  const fontClass = isRTL() ? "font-ar font-fa" : "";

  // Determine variant class
  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    success: "bg-green-500 hover:bg-green-600 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
    link: "bg-transparent hover:underline text-blue-500",
  };

  // Determine size class
  const sizeClasses = {
    sm: "py-1 px-2 text-sm",
    md: "py-2 px-4",
    lg: "py-3 px-6 text-lg",
  };

  // Determine disabled class
  const disabledClass =
    disabled || isLoading ? "opacity-50 cursor-not-allowed" : "";

  // Determine icon order based on RTL
  const IconLeft = isRTL() ? rightIcon : leftIcon;
  const IconRight = isRTL() ? leftIcon : rightIcon;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${variantClasses[variant] || variantClasses.primary}
        ${sizeClasses[size] || sizeClasses.md}
        ${disabledClass}
        ${fontClass}
        rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        transition-colors duration-200
        flex items-center justify-center
        ${className}
      `}
      {...rest}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}

      {IconLeft && (
        <span className={isRTL() ? "ml-2" : "mr-2"}>{IconLeft}</span>
      )}

      {children ||
        (isLoading && loadingText ? t(loadingText) : text ? t(text) : "")}

      {IconRight && (
        <span className={isRTL() ? "mr-2" : "ml-2"}>{IconRight}</span>
      )}
    </button>
  );
};

export default LocalizedButton;
