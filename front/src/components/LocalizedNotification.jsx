import React, { useEffect, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { NOTIFICATION_TYPES } from "../contexts/NotificationContext";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";

/**
 * A language-aware notification component that adapts to the current language
 *
 * @param {Object} props - Component props
 * @param {string} props.id - Notification ID
 * @param {string} props.message - Notification message
 * @param {string} props.type - Notification type
 * @param {function} props.onClose - Close handler
 * @param {number} props.duration - Auto-close duration in milliseconds
 * @param {string} props.className - Additional class names
 */
const LocalizedNotification = ({
  id,
  message,
  type = NOTIFICATION_TYPES.INFO,
  onClose,
  duration = 5000,
  className = "",
  ...rest
}) => {
  const { isRTL } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const [intervalId, setIntervalId] = useState(null);

  // Determine font class based on language
  const fontClass = isRTL() ? "font-ar font-fa" : "";

  // Determine direction class based on language
  const dirClass = isRTL() ? "rtl" : "ltr";

  // Determine variant class
  const variantClasses = {
    [NOTIFICATION_TYPES.SUCCESS]:
      "bg-green-100 border-green-400 text-green-700",
    [NOTIFICATION_TYPES.ERROR]: "bg-red-100 border-red-400 text-red-700",
    [NOTIFICATION_TYPES.WARNING]:
      "bg-yellow-100 border-yellow-400 text-yellow-700",
    [NOTIFICATION_TYPES.INFO]: "bg-blue-100 border-blue-400 text-blue-700",
  };

  // Determine icon based on type
  const getIcon = () => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return <FaCheckCircle className="h-5 w-5" />;
      case NOTIFICATION_TYPES.ERROR:
        return <FaExclamationCircle className="h-5 w-5" />;
      case NOTIFICATION_TYPES.WARNING:
        return <FaExclamationTriangle className="h-5 w-5" />;
      case NOTIFICATION_TYPES.INFO:
      default:
        return <FaInfoCircle className="h-5 w-5" />;
    }
  };

  // Handle animation and auto-close
  useEffect(() => {
    // Show notification with animation
    setIsVisible(true);

    // Set up progress bar if duration is provided
    if (duration > 0) {
      const startTime = Date.now();
      const endTime = startTime + duration;

      const id = setInterval(() => {
        const now = Date.now();
        const remaining = endTime - now;
        const percentage = Math.max(0, (remaining / duration) * 100);

        setProgress(percentage);

        if (percentage <= 0) {
          clearInterval(id);
          setIsVisible(false);
          setTimeout(() => {
            onClose && onClose();
          }, 300); // Wait for exit animation
        }
      }, 16); // ~60fps

      setIntervalId(id);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [duration, onClose, intervalId]);

  // Handle close
  const handleClose = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    setIsVisible(false);
    setTimeout(() => {
      onClose && onClose();
    }, 300); // Wait for exit animation
  };

  return (
    <div
      className={`
        ${fontClass}
        ${dirClass}
        ${variantClasses[type] || variantClasses[NOTIFICATION_TYPES.INFO]}
        ${
          isVisible
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform -translate-y-2"
        }
        border rounded-md shadow-md p-4 mb-3 relative transition-all duration-300 ease-in-out
        ${className}
      `}
      role="alert"
      {...rest}
    >
      <div className="flex items-center">
        <div className={`flex-shrink-0 ${isRTL() ? "ml-3" : "mr-3"}`}>
          {getIcon()}
        </div>
        <div className="flex-grow">{message}</div>
        <button
          type="button"
          className={`flex-shrink-0 ${
            isRTL() ? "mr-3" : "ml-3"
          } text-gray-500 hover:text-gray-700 focus:outline-none`}
          onClick={handleClose}
          aria-label="Close"
        >
          <FaTimes className="h-4 w-4" />
        </button>
      </div>

      {duration > 0 && (
        <div
          className="absolute bottom-0 left-0 h-1 bg-current opacity-25"
          style={{ width: `${progress}%`, transition: "width 0.1s linear" }}
        />
      )}
    </div>
  );
};

export default LocalizedNotification;
