import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";

/**
 * A language-aware link component that adapts to the current language
 *
 * @param {Object} props - Component props
 * @param {string} props.to - Link destination (for internal links)
 * @param {string} props.href - Link destination (alternative to 'to', preferred for external links)
 * @param {string} props.text - Link text (translation key) - deprecated, use translationKey instead
 * @param {string} props.translationKey - Link text (translation key)
 * @param {string} props.className - Additional class names
 * @param {React.ReactNode} props.leftIcon - Icon to display on the left
 * @param {React.ReactNode} props.rightIcon - Icon to display on the right
 * @param {boolean} props.external - Whether the link is external
 * @param {boolean} props.mobileFriendly - Whether to add mobile-friendly styles
 * @param {string} props.activeClassName - Class to apply when link is active
 */
const LocalizedLink = ({
  to,
  href,
  text,
  translationKey,
  className = "",
  leftIcon,
  rightIcon,
  external = false,
  children,
  mobileFriendly = false,
  activeClassName = "",
  ...rest
}) => {
  const { t } = useTranslation();
  const { isRTL, currentLanguage } = useLanguage();

  // Use href if provided, otherwise use to
  const linkDestination = href || to;

  // Use translationKey if provided, otherwise use text (for backward compatibility)
  const translationKeyToUse = translationKey || text;

  // Determine font class based on language
  const getFontClass = () => {
    switch (currentLanguage) {
      case "fa":
        return "font-fa";
      case "ar":
        return "font-ar";
      case "tr":
        return "font-tr";
      case "sv":
        return "font-sv";
      default:
        return "";
    }
  };

  // Determine icon order based on RTL
  const IconLeft = isRTL() ? rightIcon : leftIcon;
  const IconRight = isRTL() ? leftIcon : rightIcon;

  // Default link styles
  const defaultClassName =
    "text-blue-500 hover:text-blue-700 hover:underline transition-colors duration-200";

  // Mobile friendly styles
  const mobileClass = mobileFriendly
    ? "py-2 px-3 flex items-center mobile-touch-target"
    : "";

  // RTL specific classes
  const rtlClass = isRTL() ? "rtl-link" : "";

  const content = (
    <>
      {IconLeft && (
        <span
          className={`${isRTL() ? "ml-2 icon-right" : "mr-2 icon-left"} ${
            mobileFriendly ? "mobile-icon-left" : ""
          }`}
        >
          {IconLeft}
        </span>
      )}
      <span className={mobileFriendly ? "mobile-text-base" : ""}>
        {children || (translationKeyToUse ? t(translationKeyToUse) : "")}
      </span>
      {IconRight && (
        <span
          className={`${isRTL() ? "mr-2 icon-left" : "ml-2 icon-right"} ${
            mobileFriendly ? "mobile-icon-right" : ""
          }`}
        >
          {IconRight}
        </span>
      )}
    </>
  );

  // If external is true or href is provided, render an anchor tag
  if (external || href) {
    return (
      <a
        href={linkDestination}
        className={`${defaultClassName} ${getFontClass()} ${rtlClass} ${mobileClass} ${className}`}
        target="_blank"
        rel="noopener noreferrer"
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      to={linkDestination}
      className={`${defaultClassName} ${getFontClass()} ${rtlClass} ${mobileClass} ${className}`}
      {...rest}
    >
      {content}
    </Link>
  );
};

export default LocalizedLink;
