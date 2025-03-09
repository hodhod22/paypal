import React from "react";
import PropTypes from "prop-types";
import { useLanguage } from "../contexts/LanguageContext";
import { formatTimeIntl } from "../utils/dateTimeFormatters";

/**
 * A language-aware time component that displays times in the current language format
 *
 * @param {Object} props - Component props
 * @param {Date|string|number} props.time - The time to display
 * @param {Object} props.options - Intl.DateTimeFormat options
 * @param {string} props.className - Additional class names
 */
const LocalizedTime = ({ time, options = {}, className = "", ...rest }) => {
  const { isRTL } = useLanguage();

  // Determine font class based on language
  const fontClass = isRTL() ? "font-ar font-fa" : "";

  // If time is invalid, return empty string
  if (!time) return <span className={`${fontClass} ${className}`}>-</span>;

  // Format the time
  const formattedTime = formatTimeIntl(time, options);

  return (
    <span className={`${fontClass} ${className}`} {...rest}>
      {formattedTime}
    </span>
  );
};

LocalizedTime.propTypes = {
  time: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
  ]),
  options: PropTypes.object,
  className: PropTypes.string,
};

export default LocalizedTime;
