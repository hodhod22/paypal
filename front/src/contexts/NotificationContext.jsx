import React, { createContext, useContext, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

// Create notification context
const NotificationContext = createContext();

/**
 * Notification types
 */
export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

/**
 * Notification positions
 */
export const NOTIFICATION_POSITIONS = {
  TOP_RIGHT: "top-right",
  TOP_LEFT: "top-left",
  BOTTOM_RIGHT: "bottom-right",
  BOTTOM_LEFT: "bottom-left",
  TOP_CENTER: "top-center",
  BOTTOM_CENTER: "bottom-center",
};

/**
 * NotificationProvider component
 * Provides notification functionality to the application
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { t } = useTranslation();

  /**
   * Add a notification
   * @param {string} message - The notification message or translation key
   * @param {string} type - The notification type
   * @param {number} duration - The notification duration in milliseconds
   * @param {string} position - The notification position
   * @param {boolean} isTranslationKey - Whether the message is a translation key
   * @returns {string} - The notification ID
   */
  const addNotification = useCallback(
    (
      message,
      type = NOTIFICATION_TYPES.INFO,
      duration = 5000,
      position = NOTIFICATION_POSITIONS.TOP_RIGHT,
      isTranslationKey = true
    ) => {
      const id = uuidv4();
      const displayMessage = isTranslationKey ? t(message) : message;

      setNotifications((prev) => [
        ...prev,
        {
          id,
          message: displayMessage,
          type,
          duration,
          position,
          createdAt: Date.now(),
        },
      ]);

      // Auto-remove notification after duration
      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }

      return id;
    },
    [t]
  );

  /**
   * Remove a notification by ID
   * @param {string} id - The notification ID
   */
  const removeNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  /**
   * Clear all notifications
   */
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  /**
   * Shorthand methods for different notification types
   */
  const success = useCallback(
    (message, duration, position, isTranslationKey) => {
      return addNotification(
        message,
        NOTIFICATION_TYPES.SUCCESS,
        duration,
        position,
        isTranslationKey
      );
    },
    [addNotification]
  );

  const error = useCallback(
    (message, duration, position, isTranslationKey) => {
      return addNotification(
        message,
        NOTIFICATION_TYPES.ERROR,
        duration,
        position,
        isTranslationKey
      );
    },
    [addNotification]
  );

  const warning = useCallback(
    (message, duration, position, isTranslationKey) => {
      return addNotification(
        message,
        NOTIFICATION_TYPES.WARNING,
        duration,
        position,
        isTranslationKey
      );
    },
    [addNotification]
  );

  const info = useCallback(
    (message, duration, position, isTranslationKey) => {
      return addNotification(
        message,
        NOTIFICATION_TYPES.INFO,
        duration,
        position,
        isTranslationKey
      );
    },
    [addNotification]
  );

  // Group notifications by position
  const notificationsByPosition = notifications.reduce((acc, notification) => {
    if (!acc[notification.position]) {
      acc[notification.position] = [];
    }
    acc[notification.position].push(notification);
    return acc;
  }, {});

  // Context value
  const value = {
    notifications,
    notificationsByPosition,
    addNotification,
    removeNotification,
    clearNotifications,
    success,
    error,
    warning,
    info,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * Custom hook to use the notification context
 * @returns {Object} - The notification context
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

export default NotificationContext;
