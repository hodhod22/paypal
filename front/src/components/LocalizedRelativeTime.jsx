import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useLanguage } from "../contexts/LanguageContext";
import { formatDistanceDate } from "../utils/dateTimeFormatters";

/**
 * A language-aware relative time component that displays relative times in the current language format
 *
 * @param {Object} props - Component props
 * @param {Date|string|number} props.date - The date to display relative to now
 * @param {boolean} props.live - Whether to update the relative time live
 * @param {number} props.updateInterval - The interval in milliseconds to update the relative time
 * @param {Object} props.options - Additional options for the formatter
 * @param {string} props.className - Additional class names
 */
const LocalizedRelativeTime = ({
  date,
  live = false,
  updateInterval = 60000, // 1 minute
  options = {},
  className = "",
  ...rest
}) => {
  const { isRTL } = useLanguage();
  const [formattedTime, setFormattedTime] = useState("");

  // Determine font class based on language
  const fontClass = isRTL() ? "font-ar font-fa" : "";

  // Update the formatted time
  const updateFormattedTime = () => {
    if (!date) {
      setFormattedTime("-");
      return;
    }

    setFormattedTime(formatDistanceDate(date, new Date(), options));
  };

  // Update the formatted time initially and when the date changes
  useEffect(() => {
    updateFormattedTime();
  }, [date]);

  // Update the formatted time at the specified interval if live is true
  useEffect(() => {
    if (!live) return;

    const intervalId = setInterval(updateFormattedTime, updateInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [live, updateInterval, date]);

  // If date is invalid, return empty string
  if (!date) return <span className={`${fontClass} ${className}`}>-</span>;

  return (
    <span className={`${fontClass} ${className}`} {...rest}>
      {formattedTime}
    </span>
  );
};

LocalizedRelativeTime.propTypes = {
  date: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
  ]),
  live: PropTypes.bool,
  updateInterval: PropTypes.number,
  options: PropTypes.object,
  className: PropTypes.string,
};

export default LocalizedRelativeTime;
