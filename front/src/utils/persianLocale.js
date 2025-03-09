/**
 * Custom Persian locale for date-fns
 * Based on the Arabic locale with Persian translations
 */

const persianLocale = {
  code: "fa",
  formatDistance: {
    lessThanXSeconds: {
      one: "کمتر از یک ثانیه",
      other: "کمتر از {{count}} ثانیه",
    },
    xSeconds: {
      one: "یک ثانیه",
      other: "{{count}} ثانیه",
    },
    halfAMinute: "نیم دقیقه",
    lessThanXMinutes: {
      one: "کمتر از یک دقیقه",
      other: "کمتر از {{count}} دقیقه",
    },
    xMinutes: {
      one: "یک دقیقه",
      other: "{{count}} دقیقه",
    },
    aboutXHours: {
      one: "حدود یک ساعت",
      other: "حدود {{count}} ساعت",
    },
    xHours: {
      one: "یک ساعت",
      other: "{{count}} ساعت",
    },
    xDays: {
      one: "یک روز",
      other: "{{count}} روز",
    },
    aboutXWeeks: {
      one: "حدود یک هفته",
      other: "حدود {{count}} هفته",
    },
    xWeeks: {
      one: "یک هفته",
      other: "{{count}} هفته",
    },
    aboutXMonths: {
      one: "حدود یک ماه",
      other: "حدود {{count}} ماه",
    },
    xMonths: {
      one: "یک ماه",
      other: "{{count}} ماه",
    },
    aboutXYears: {
      one: "حدود یک سال",
      other: "حدود {{count}} سال",
    },
    xYears: {
      one: "یک سال",
      other: "{{count}} سال",
    },
    overXYears: {
      one: "بیش از یک سال",
      other: "بیش از {{count}} سال",
    },
    almostXYears: {
      one: "تقریباً یک سال",
      other: "تقریباً {{count}} سال",
    },
  },

  formatRelative: (token) => {
    const translations = {
      lastWeek: "dddd 'گذشته در' p",
      yesterday: "'دیروز در' p",
      today: "'امروز در' p",
      tomorrow: "'فردا در' p",
      nextWeek: "dddd 'در' p",
      other: "P",
    };
    return translations[token];
  },

  formatLong: {
    date: {
      full: "EEEE do MMMM y",
      long: "do MMMM y",
      medium: "d MMM y",
      short: "yyyy/MM/dd",
    },
    time: {
      full: "h:mm:ss a zzzz",
      long: "h:mm:ss a z",
      medium: "h:mm:ss a",
      short: "h:mm a",
    },
    dateTime: {
      full: "{{date}} 'در' {{time}}",
      long: "{{date}} 'در' {{time}}",
      medium: "{{date}}, {{time}}",
      short: "{{date}}, {{time}}",
    },
  },

  ordinalNumber: (dirtyNumber) => {
    const number = Number(dirtyNumber);
    return number + "م";
  },

  localize: {
    month: (month, { width }) => {
      const values = {
        narrow: ["ژ", "ف", "م", "آ", "م", "ژ", "ژ", "آ", "س", "ا", "ن", "د"],
        abbreviated: [
          "ژانویه",
          "فوریه",
          "مارس",
          "آوریل",
          "مه",
          "ژوئن",
          "ژوئیه",
          "آگوست",
          "سپتامبر",
          "اکتبر",
          "نوامبر",
          "دسامبر",
        ],
        wide: [
          "ژانویه",
          "فوریه",
          "مارس",
          "آوریل",
          "مه",
          "ژوئن",
          "ژوئیه",
          "آگوست",
          "سپتامبر",
          "اکتبر",
          "نوامبر",
          "دسامبر",
        ],
      };
      return values[width][month];
    },

    day: (day, { width }) => {
      const values = {
        narrow: ["ی", "د", "س", "چ", "پ", "ج", "ش"],
        short: ["یک", "دو", "سه", "چهار", "پنج", "جمعه", "شنبه"],
        abbreviated: [
          "یکشنبه",
          "دوشنبه",
          "سه‌شنبه",
          "چهارشنبه",
          "پنجشنبه",
          "جمعه",
          "شنبه",
        ],
        wide: [
          "یکشنبه",
          "دوشنبه",
          "سه‌شنبه",
          "چهارشنبه",
          "پنجشنبه",
          "جمعه",
          "شنبه",
        ],
      };
      return values[width][day];
    },

    dayPeriod: (dayPeriod, { width }) => {
      const values = {
        narrow: {
          am: "ق",
          pm: "ب",
          midnight: "ن",
          noon: "ظ",
          morning: "ص",
          afternoon: "ب.ظ",
          evening: "ع",
          night: "ش",
        },
        abbreviated: {
          am: "ق.ظ",
          pm: "ب.ظ",
          midnight: "نیمه‌شب",
          noon: "ظهر",
          morning: "صبح",
          afternoon: "بعدازظهر",
          evening: "عصر",
          night: "شب",
        },
        wide: {
          am: "قبل‌ازظهر",
          pm: "بعدازظهر",
          midnight: "نیمه‌شب",
          noon: "ظهر",
          morning: "صبح",
          afternoon: "بعدازظهر",
          evening: "عصر",
          night: "شب",
        },
      };
      return values[width][dayPeriod];
    },
  },

  match: {
    ordinalNumber: /^(\d+)(م)?/i,
    era: /^(ق\.م\.?|ب\.م\.?|قبل از میلاد|بعد از میلاد)/i,
    quarter: /^سه‌ماهه (اول|دوم|سوم|چهارم)/i,
    month:
      /^(ژانویه|فوریه|مارس|آوریل|مه|ژوئن|ژوئیه|آگوست|سپتامبر|اکتبر|نوامبر|دسامبر)/i,
    day: /^(یکشنبه|دوشنبه|سه‌شنبه|چهارشنبه|پنجشنبه|جمعه|شنبه)/i,
    dayPeriod: /^(ق\.ظ\.?|ب\.ظ\.?|نیمه‌شب|ظهر|صبح|بعدازظهر|عصر|شب)/i,
  },

  options: {
    weekStartsOn: 6, // Saturday is the first day of the week in Persian calendar
    firstWeekContainsDate: 1,
  },
};

export default persianLocale;
