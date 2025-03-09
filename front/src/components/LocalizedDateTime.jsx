import React from "react";
import PropTypes from "prop-types";
import { useLanguage } from "../contexts/LanguageContext";
import { formatDateTimeIntl } from "../utils/dateTimeFormatters";

/**
 * A language-aware date and time component that displays both in the current language format
 *
 * @param {Object} props - Component props
 * @param {Date|string|number} props.dateTime - The date and time to display
 * @param {Object} props.options - Intl.DateTimeFormat options
 * @param {string} props.className - Additional class names
 */
const LocalizedDateTime = ({
  dateTime,
  options = {},
  className = "",
  ...rest
}) => {
  const { isRTL } = useLanguage();

  // Determine font class based on language
  const fontClass = isRTL() ? "font-ar font-fa" : "";

  // If dateTime is invalid, return empty string
  if (!dateTime) return <span className={`${fontClass} ${className}`}>-</span>;

  // Format the date and time
  const formattedDateTime = formatDateTimeIntl(dateTime, options);

  return (
    <span className={`${fontClass} ${className}`} {...rest}>
      {formattedDateTime}
    </span>
  );
};

LocalizedDateTime.propTypes = {
  dateTime: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
  ]),
  options: PropTypes.object,
  className: PropTypes.string,
};

export default LocalizedDateTime;
