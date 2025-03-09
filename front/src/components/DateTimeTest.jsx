import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import {
  formatDate,
  formatRelativeDate,
  formatDistanceDate,
  formatDateIntl,
  getMonthNames,
  getDayNames,
} from "../utils/dateTimeFormatters";
import LocalizedButton from "./LocalizedButton";

const DateTimeTest = () => {
  const { t, i18n } = useTranslation();
  const { isRTL, languages } = useLanguage();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  // Font class for RTL languages
  const fontClass = isRTL() ? "font-ar font-fa" : "";

  // Create dates for examples
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastWeek = new Date(now);
  lastWeek.setDate(lastWeek.getDate() - 7);

  // Change language
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
  };

  // Get localized month and day names
  const monthNames = getMonthNames();
  const dayNames = getDayNames();

  return (
    <div className={`p-6 ${fontClass}`}>
      <h2 className="text-xl font-bold mb-4">Date Formatting Test</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Language Switcher</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(languages).map(([code, lang]) => (
            <button
              key={code}
              onClick={() => changeLanguage(code)}
              className={`px-3 py-1 rounded ${
                currentLanguage === code
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {lang.nativeName}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Current Language: {languages[currentLanguage]?.name}
        </h3>
        <p>
          Direction: {isRTL() ? "Right-to-Left (RTL)" : "Left-to-Right (LTR)"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Date Formats</h3>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Default format:</span>{" "}
              {formatDate(now)}
            </div>
            <div>
              <span className="font-medium">Short format:</span>{" "}
              {formatDate(now, "P")}
            </div>
            <div>
              <span className="font-medium">Medium format:</span>{" "}
              {formatDate(now, "PP")}
            </div>
            <div>
              <span className="font-medium">Long format:</span>{" "}
              {formatDate(now, "PPP")}
            </div>
            <div>
              <span className="font-medium">Full format:</span>{" "}
              {formatDate(now, "PPPP")}
            </div>
          </div>
        </div>

        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Relative Dates</h3>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Today:</span>{" "}
              {formatRelativeDate(now)}
            </div>
            <div>
              <span className="font-medium">Yesterday:</span>{" "}
              {formatRelativeDate(yesterday)}
            </div>
            <div>
              <span className="font-medium">Last week:</span>{" "}
              {formatRelativeDate(lastWeek)}
            </div>
            <div>
              <span className="font-medium">Distance to today:</span>{" "}
              {formatDistanceDate(now)}
            </div>
            <div>
              <span className="font-medium">Distance to yesterday:</span>{" "}
              {formatDistanceDate(yesterday)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Month Names</h3>
          <div className="grid grid-cols-3 gap-2">
            {monthNames.map((month, index) => (
              <div key={index} className="text-sm">
                {month}
              </div>
            ))}
          </div>
        </div>

        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Day Names</h3>
          <div className="grid grid-cols-3 gap-2">
            {dayNames.map((day, index) => (
              <div key={index} className="text-sm">
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border p-4 rounded mb-6">
        <h3 className="font-semibold mb-2">Intl DateTimeFormat</h3>
        <div className="space-y-2">
          <div>
            <span className="font-medium">Short:</span>{" "}
            {formatDateIntl(now, { dateStyle: "short" })}
          </div>
          <div>
            <span className="font-medium">Medium:</span>{" "}
            {formatDateIntl(now, { dateStyle: "medium" })}
          </div>
          <div>
            <span className="font-medium">Long:</span>{" "}
            {formatDateIntl(now, { dateStyle: "long" })}
          </div>
          <div>
            <span className="font-medium">Full:</span>{" "}
            {formatDateIntl(now, { dateStyle: "full" })}
          </div>
        </div>
      </div>

      <LocalizedButton
        text="common.back"
        onClick={() => window.history.back()}
        className="mt-4"
      />
    </div>
  );
};

export default DateTimeTest;
