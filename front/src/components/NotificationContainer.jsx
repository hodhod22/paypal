import React from "react";
import {
  useNotification,
  NOTIFICATION_POSITIONS,
} from "../contexts/NotificationContext";
import LocalizedNotification from "./LocalizedNotification";

/**
 * Container for displaying notifications at different positions
 */
const NotificationContainer = () => {
  const { notificationsByPosition, removeNotification } = useNotification();

  // Position classes
  const positionClasses = {
    [NOTIFICATION_POSITIONS.TOP_RIGHT]: "top-4 right-4",
    [NOTIFICATION_POSITIONS.TOP_LEFT]: "top-4 left-4",
    [NOTIFICATION_POSITIONS.BOTTOM_RIGHT]: "bottom-4 right-4",
    [NOTIFICATION_POSITIONS.BOTTOM_LEFT]: "bottom-4 left-4",
    [NOTIFICATION_POSITIONS.TOP_CENTER]:
      "top-4 left-1/2 transform -translate-x-1/2",
    [NOTIFICATION_POSITIONS.BOTTOM_CENTER]:
      "bottom-4 left-1/2 transform -translate-x-1/2",
  };

  // Render notifications for each position
  return (
    <>
      {Object.entries(notificationsByPosition).map(
        ([position, notifications]) => (
          <div
            key={position}
            className={`fixed z-50 w-80 max-w-full ${
              positionClasses[position] ||
              positionClasses[NOTIFICATION_POSITIONS.TOP_RIGHT]
            }`}
            aria-live="polite"
          >
            {notifications.map((notification) => (
              <LocalizedNotification
                key={notification.id}
                id={notification.id}
                message={notification.message}
                type={notification.type}
                duration={notification.duration}
                onClose={() => removeNotification(notification.id)}
              />
            ))}
          </div>
        )
      )}
    </>
  );
};

export default NotificationContainer;
