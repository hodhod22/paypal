import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import {
  useNotification,
  NOTIFICATION_TYPES,
  NOTIFICATION_POSITIONS,
} from "../contexts/NotificationContext";
import LocalizedButton from "../components/LocalizedButton";
import LocalizedSelect from "../components/LocalizedSelect";
import LocalizedInput from "../components/LocalizedInput";

const NotificationDemo = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { success, error, warning, info } = useNotification();

  const [notificationType, setNotificationType] = useState(
    NOTIFICATION_TYPES.INFO
  );
  const [notificationPosition, setNotificationPosition] = useState(
    NOTIFICATION_POSITIONS.TOP_RIGHT
  );
  const [notificationDuration, setNotificationDuration] = useState(5000);
  const [customMessage, setCustomMessage] = useState("");

  // Font class for RTL languages
  const fontClass = isRTL() ? "font-ar font-fa" : "";

  // Type options for select
  const typeOptions = [
    {
      value: NOTIFICATION_TYPES.SUCCESS,
      translationKey: "notifications.success",
    },
    { value: NOTIFICATION_TYPES.ERROR, translationKey: "notifications.error" },
    {
      value: NOTIFICATION_TYPES.WARNING,
      translationKey: "notifications.warning",
    },
    { value: NOTIFICATION_TYPES.INFO, translationKey: "notifications.info" },
  ];

  // Position options for select
  const positionOptions = [
    {
      value: NOTIFICATION_POSITIONS.TOP_RIGHT,
      translationKey: "notifications.topRight",
    },
    {
      value: NOTIFICATION_POSITIONS.TOP_LEFT,
      translationKey: "notifications.topLeft",
    },
    {
      value: NOTIFICATION_POSITIONS.BOTTOM_RIGHT,
      translationKey: "notifications.bottomRight",
    },
    {
      value: NOTIFICATION_POSITIONS.BOTTOM_LEFT,
      translationKey: "notifications.bottomLeft",
    },
    {
      value: NOTIFICATION_POSITIONS.TOP_CENTER,
      translationKey: "notifications.topCenter",
    },
    {
      value: NOTIFICATION_POSITIONS.BOTTOM_CENTER,
      translationKey: "notifications.bottomCenter",
    },
  ];

  // Duration options for select
  const durationOptions = [
    { value: 3000, translationKey: "notifications.short" },
    { value: 5000, translationKey: "notifications.medium" },
    { value: 8000, translationKey: "notifications.long" },
    { value: 0, translationKey: "notifications.permanent" },
  ];

  // Show notification based on type
  const showNotification = () => {
    const message = customMessage || t("notifications.demoMessage");

    switch (notificationType) {
      case NOTIFICATION_TYPES.SUCCESS:
        success(message, notificationDuration, notificationPosition, false);
        break;
      case NOTIFICATION_TYPES.ERROR:
        error(message, notificationDuration, notificationPosition, false);
        break;
      case NOTIFICATION_TYPES.WARNING:
        warning(message, notificationDuration, notificationPosition, false);
        break;
      case NOTIFICATION_TYPES.INFO:
      default:
        info(message, notificationDuration, notificationPosition, false);
        break;
    }
  };

  // Show predefined notifications
  const showSuccessNotification = () => {
    success(
      "notifications.successMessage",
      5000,
      NOTIFICATION_POSITIONS.TOP_RIGHT
    );
  };

  const showErrorNotification = () => {
    error("notifications.errorMessage", 5000, NOTIFICATION_POSITIONS.TOP_RIGHT);
  };

  const showWarningNotification = () => {
    warning(
      "notifications.warningMessage",
      5000,
      NOTIFICATION_POSITIONS.TOP_RIGHT
    );
  };

  const showInfoNotification = () => {
    info("notifications.infoMessage", 5000, NOTIFICATION_POSITIONS.TOP_RIGHT);
  };

  return (
    <div className={`p-6 ${fontClass}`}>
      <h1 className="text-2xl font-bold mb-6">
        {t("notifications.demoTitle")}
      </h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {t("notifications.predefined")}
        </h2>
        <div className="flex flex-wrap gap-4">
          <LocalizedButton
            text="notifications.showSuccess"
            onClick={showSuccessNotification}
            variant="success"
          />
          <LocalizedButton
            text="notifications.showError"
            onClick={showErrorNotification}
            variant="danger"
          />
          <LocalizedButton
            text="notifications.showWarning"
            onClick={showWarningNotification}
            variant="warning"
          />
          <LocalizedButton
            text="notifications.showInfo"
            onClick={showInfoNotification}
            variant="info"
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {t("notifications.custom")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <LocalizedSelect
              label="notifications.type"
              value={notificationType}
              onChange={(e) => setNotificationType(e.target.value)}
              options={typeOptions}
            />

            <LocalizedSelect
              label="notifications.position"
              value={notificationPosition}
              onChange={(e) => setNotificationPosition(e.target.value)}
              options={positionOptions}
            />

            <LocalizedSelect
              label="notifications.duration"
              value={notificationDuration}
              onChange={(e) => setNotificationDuration(Number(e.target.value))}
              options={durationOptions}
            />
          </div>

          <div className="space-y-4">
            <LocalizedInput
              type="text"
              label="notifications.message"
              placeholder="notifications.enterMessage"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
            />

            <div className="pt-6">
              <LocalizedButton
                text="notifications.show"
                onClick={showNotification}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="font-semibold mb-2">{t("notifications.usage")}</h3>
        <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
          {`
// Import the hook
import { useNotification } from '../contexts/NotificationContext';

// Use the hook in your component
const { success, error, warning, info } = useNotification();

// Show a success notification
success('notifications.successMessage');

// Show an error notification
error('notifications.errorMessage');

// Show a warning notification
warning('notifications.warningMessage');

// Show an info notification
info('notifications.infoMessage');

// With custom duration and position
success('notifications.successMessage', 8000, 'top-center');

// With direct message (not a translation key)
success('Operation completed successfully!', 5000, 'top-right', false);
          `}
        </pre>
      </div>
    </div>
  );
};

export default NotificationDemo;
