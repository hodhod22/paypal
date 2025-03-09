import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import {
  formatDate,
  formatRelativeDate,
  formatDistanceDate,
  formatDateIntl,
  isDateToday,
} from "../utils/dateTimeFormatters";

/**
 * A language-aware date component that displays dates in the current language format
 *
 * @param {Object} props - Component props
 * @param {Date|string|number} props.date - The date to display
 * @param {string} props.format - The format to use (date-fns format string)
 * @param {string} props.variant - The variant to use ('normal', 'relative', 'distance', 'intl')
 * @param {Object} props.options - Additional options for the formatter
 * @param {boolean} props.showRelativeForRecent - Whether to show relative dates for recent dates
 * @param {number} props.recentDays - Number of days to consider recent
 * @param {string} props.className - Additional class names
 */
const LocalizedDate = ({
  date,
  format = "PP",
  variant = "normal",
  options = {},
  showRelativeForRecent = false,
  recentDays = 7,
  className = "",
  ...rest
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  // Determine font class based on language
  const fontClass = isRTL() ? "font-ar font-fa" : "";

  // If date is invalid, return empty string
  if (!date) return <span className={`${fontClass} ${className}`}>-</span>;

  // Format the date based on the variant
  let formattedDate = "";

  // Check if date is recent and should be displayed as relative
  if (showRelativeForRecent) {
    const dateObj = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - dateObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= recentDays) {
      // If date is today, show "Today" instead of relative date
      if (isDateToday(dateObj)) {
        return (
          <span className={`${fontClass} ${className}`} {...rest}>
            {t("dateTime.today")}
          </span>
        );
      }

      // Show relative date for recent dates
      formattedDate = formatRelativeDate(date, new Date(), options);
      return (
        <span className={`${fontClass} ${className}`} {...rest}>
          {formattedDate}
        </span>
      );
    }
  }

  // Format based on variant
  switch (variant) {
    case "relative":
      formattedDate = formatRelativeDate(date, new Date(), options);
      break;
    case "distance":
      formattedDate = formatDistanceDate(date, new Date(), options);
      break;
    case "intl":
      formattedDate = formatDateIntl(date, options);
      break;
    case "normal":
    default:
      formattedDate = formatDate(date, format, options);
      break;
  }

  return (
    <span className={`${fontClass} ${className}`} {...rest}>
      {formattedDate}
    </span>
  );
};

LocalizedDate.propTypes = {
  date: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
  ]),
  format: PropTypes.string,
  variant: PropTypes.oneOf(["normal", "relative", "distance", "intl"]),
  options: PropTypes.object,
  showRelativeForRecent: PropTypes.bool,
  recentDays: PropTypes.number,
  className: PropTypes.string,
};

export default LocalizedDate;
