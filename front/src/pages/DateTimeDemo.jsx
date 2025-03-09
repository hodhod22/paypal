import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import LocalizedDate from "../components/LocalizedDate";
import LocalizedTime from "../components/LocalizedTime";
import LocalizedDateTime from "../components/LocalizedDateTime";
import LocalizedRelativeTime from "../components/LocalizedRelativeTime";
import LocalizedSelect from "../components/LocalizedSelect";
import LocalizedButton from "../components/LocalizedButton";
import { getMonthNames, getDayNames } from "../utils/dateTimeFormatters";

const DateTimeDemo = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Font class for RTL languages
  const fontClass = isRTL() ? "font-ar font-fa" : "";

  // Create dates for examples
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastWeek = new Date(now);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const lastMonth = new Date(now);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const lastYear = new Date(now);
  lastYear.setFullYear(lastYear.getFullYear() - 1);

  // Get localized month and day names
  const monthNames = getMonthNames();
  const dayNames = getDayNames();

  // Handle date change
  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  return (
    <div className={`p-6 ${fontClass}`}>
      <h1 className="text-2xl font-bold mb-6">{t("dateTime.demoTitle")}</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {t("dateTime.selectDate")}
        </h2>
        <input
          type="date"
          value={selectedDate.toISOString().split("T")[0]}
          onChange={handleDateChange}
          className="p-2 border rounded"
        />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {t("dateTime.dateFormats")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">{t("dateTime.normalFormat")}</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">{t("dateTime.default")}:</span>{" "}
                <LocalizedDate date={selectedDate} />
              </div>
              <div>
                <span className="font-medium">{t("dateTime.short")}:</span>{" "}
                <LocalizedDate date={selectedDate} format="P" />
              </div>
              <div>
                <span className="font-medium">{t("dateTime.medium")}:</span>{" "}
                <LocalizedDate date={selectedDate} format="PP" />
              </div>
              <div>
                <span className="font-medium">{t("dateTime.long")}:</span>{" "}
                <LocalizedDate date={selectedDate} format="PPP" />
              </div>
              <div>
                <span className="font-medium">{t("dateTime.full")}:</span>{" "}
                <LocalizedDate date={selectedDate} format="PPPP" />
              </div>
            </div>
          </div>

          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">{t("dateTime.intlFormat")}</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">{t("dateTime.numeric")}:</span>{" "}
                <LocalizedDate
                  date={selectedDate}
                  variant="intl"
                  options={{ dateStyle: "short" }}
                />
              </div>
              <div>
                <span className="font-medium">{t("dateTime.short")}:</span>{" "}
                <LocalizedDate
                  date={selectedDate}
                  variant="intl"
                  options={{ dateStyle: "medium" }}
                />
              </div>
              <div>
                <span className="font-medium">{t("dateTime.long")}:</span>{" "}
                <LocalizedDate
                  date={selectedDate}
                  variant="intl"
                  options={{ dateStyle: "long" }}
                />
              </div>
              <div>
                <span className="font-medium">{t("dateTime.full")}:</span>{" "}
                <LocalizedDate
                  date={selectedDate}
                  variant="intl"
                  options={{ dateStyle: "full" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {t("dateTime.timeFormats")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">{t("dateTime.basicTime")}</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">{t("dateTime.default")}:</span>{" "}
                <LocalizedTime time={selectedDate} />
              </div>
              <div>
                <span className="font-medium">
                  {t("dateTime.withSeconds")}:
                </span>{" "}
                <LocalizedTime
                  time={selectedDate}
                  options={{ second: "numeric" }}
                />
              </div>
              <div>
                <span className="font-medium">{t("dateTime.with24Hour")}:</span>{" "}
                <LocalizedTime
                  time={selectedDate}
                  options={{ hour12: false }}
                />
              </div>
            </div>
          </div>

          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">{t("dateTime.dateAndTime")}</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">{t("dateTime.short")}:</span>{" "}
                <LocalizedDateTime
                  dateTime={selectedDate}
                  options={{ dateStyle: "short", timeStyle: "short" }}
                />
              </div>
              <div>
                <span className="font-medium">{t("dateTime.medium")}:</span>{" "}
                <LocalizedDateTime
                  dateTime={selectedDate}
                  options={{ dateStyle: "medium", timeStyle: "medium" }}
                />
              </div>
              <div>
                <span className="font-medium">{t("dateTime.long")}:</span>{" "}
                <LocalizedDateTime
                  dateTime={selectedDate}
                  options={{ dateStyle: "long", timeStyle: "long" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {t("dateTime.relativeTimes")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">{t("dateTime.relative")}</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">{t("dateTime.now")}:</span>{" "}
                <LocalizedRelativeTime date={now} live />
              </div>
              <div>
                <span className="font-medium">{t("dateTime.yesterday")}:</span>{" "}
                <LocalizedRelativeTime date={yesterday} />
              </div>
              <div>
                <span className="font-medium">{t("dateTime.lastWeek")}:</span>{" "}
                <LocalizedRelativeTime date={lastWeek} />
              </div>
              <div>
                <span className="font-medium">{t("dateTime.lastMonth")}:</span>{" "}
                <LocalizedRelativeTime date={lastMonth} />
              </div>
              <div>
                <span className="font-medium">{t("dateTime.lastYear")}:</span>{" "}
                <LocalizedRelativeTime date={lastYear} />
              </div>
            </div>
          </div>

          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">{t("dateTime.smartDate")}</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">{t("dateTime.now")}:</span>{" "}
                <LocalizedDate
                  date={now}
                  showRelativeForRecent
                  recentDays={30}
                />
              </div>
              <div>
                <span className="font-medium">{t("dateTime.yesterday")}:</span>{" "}
                <LocalizedDate
                  date={yesterday}
                  showRelativeForRecent
                  recentDays={30}
                />
              </div>
              <div>
                <span className="font-medium">{t("dateTime.lastWeek")}:</span>{" "}
                <LocalizedDate
                  date={lastWeek}
                  showRelativeForRecent
                  recentDays={30}
                />
              </div>
              <div>
                <span className="font-medium">{t("dateTime.lastMonth")}:</span>{" "}
                <LocalizedDate
                  date={lastMonth}
                  showRelativeForRecent
                  recentDays={30}
                />
              </div>
              <div>
                <span className="font-medium">{t("dateTime.lastYear")}:</span>{" "}
                <LocalizedDate
                  date={lastYear}
                  showRelativeForRecent
                  recentDays={30}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {t("dateTime.localization")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">{t("dateTime.monthNames")}</h3>
            <div className="grid grid-cols-3 gap-2">
              {monthNames.map((month, index) => (
                <div key={index} className="text-sm">
                  {month}
                </div>
              ))}
            </div>
          </div>

          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">{t("dateTime.dayNames")}</h3>
            <div className="grid grid-cols-3 gap-2">
              {dayNames.map((day, index) => (
                <div key={index} className="text-sm">
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="font-semibold mb-2">{t("dateTime.usage")}</h3>
        <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
          {`
// Import the components
import LocalizedDate from '../components/LocalizedDate';
import LocalizedTime from '../components/LocalizedTime';
import LocalizedDateTime from '../components/LocalizedDateTime';
import LocalizedRelativeTime from '../components/LocalizedRelativeTime';

// Basic usage
<LocalizedDate date={new Date()} />
<LocalizedTime time={new Date()} />
<LocalizedDateTime dateTime={new Date()} />
<LocalizedRelativeTime date={new Date()} live />

// With options
<LocalizedDate 
  date={new Date()} 
  format="PPP" 
/>

<LocalizedDate 
  date={new Date()} 
  variant="intl" 
  options={{ dateStyle: 'full' }} 
/>

<LocalizedTime 
  time={new Date()} 
  options={{ hour12: false, second: 'numeric' }} 
/>

<LocalizedDateTime 
  dateTime={new Date()} 
  options={{ dateStyle: 'long', timeStyle: 'medium' }} 
/>

// Smart date that shows relative time for recent dates
<LocalizedDate 
  date={new Date()} 
  showRelativeForRecent 
  recentDays={7} 
/>
          `}
        </pre>
      </div>
    </div>
  );
};

export default DateTimeDemo;
