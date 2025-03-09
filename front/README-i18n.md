# Internationalization (i18n) in ThirdBank

This document provides information about the internationalization features in the ThirdBank application.

## Supported Languages

The application currently supports the following languages:

- English (en) - Default
- Swedish (sv)
- Persian (fa) - Right-to-Left
- Arabic (ar) - Right-to-Left
- Turkish (tr)

## Directory Structure

The internationalization files are organized as follows:

```
front/src/
├── locales/
│   ├── en/
│   │   └── translation.json
│   ├── sv/
│   │   └── translation.json
│   ├── fa/
│   │   └── translation.json
│   ├── ar/
│   │   └── translation.json
│   └── tr/
│       └── translation.json
├── i18n.js
├── contexts/
│   └── LanguageContext.js
├── hooks/
│   └── useLanguageDetection.js
└── styles/
    ├── rtl.css
    ├── navbar.css
    └── mobile.css
```

## Using Translations

### Basic Usage

To use translations in your components, import the `useTranslation` hook from `react-i18next`:

```jsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();

  return <h1>{t("myTranslationKey")}</h1>;
}
```

### Localized Components

#### LocalizedLink

The `LocalizedLink` component is a language-aware link component that adapts to the current language, including support for RTL languages and mobile devices:

```jsx
import LocalizedLink from './components/LocalizedLink';
import { FaArrowRight } from 'react-icons/fa';

// Basic usage
<LocalizedLink to="/dashboard" text="navbar.dashboard" />

// With icons (automatically flips in RTL languages)
<LocalizedLink
  to="/dashboard"
  text="navbar.dashboard"
  rightIcon={<FaArrowRight />}
/>

// External link
<LocalizedLink
  to="https://example.com"
  text="common.externalLink"
  external={true}
/>

// Mobile-friendly link
<LocalizedLink
  to="/settings"
  text="settings.title"
  mobileFriendly={true}
/>

// With custom styling
<LocalizedLink
  to="/login"
  text="auth.login"
  className="bg-blue-500 text-white px-4 py-2 rounded"
/>
```

## RTL Support

The application includes comprehensive support for Right-to-Left (RTL) languages like Arabic and Persian.

### RTL Detection

The `LanguageContext` provides an `isRTL` function to check if the current language is RTL:

```jsx
import { useLanguage } from "../contexts/LanguageContext";

function MyComponent() {
  const { isRTL } = useLanguage();

  return (
    <div className={isRTL() ? "rtl-specific-class" : "ltr-specific-class"}>
      {/* Component content */}
    </div>
  );
}
```

### RTL Styling

The application includes RTL-specific CSS in `styles/rtl.css` that handles:

- Text direction and alignment
- Margin and padding adjustments
- Flexbox direction
- Icon positioning
- Dropdown menu positioning
- Border radius adjustments
- Transform property adjustments

### Font Support

RTL languages use specific fonts:

- Arabic: 'Noto Sans Arabic'
- Persian: 'Vazir'

These fonts are loaded in `styles/fonts.css` and applied automatically when an RTL language is selected.

## Mobile Support

The application includes mobile-specific styling and components to ensure a good user experience on mobile devices.

### Mobile-Specific CSS

Mobile-specific styles are defined in `styles/mobile.css` and include:

- Mobile menu animations
- Touch-friendly target sizes
- Mobile-specific typography
- Responsive spacing and layout
- RTL adjustments for mobile

### Mobile-Friendly Components

Components like `Navbar` and `LocalizedLink` include mobile-friendly options and responsive design.

## Language Switching

The application provides multiple ways to switch languages:

1. Using the `EnhancedLanguageSwitcher` component in the Navbar
2. Through the dedicated Language Settings page at `/settings/language`

## Adding a New Language

To add a new language:

1. Create a new folder in `src/locales` with the language code (e.g., `de` for German)
2. Add a `translation.json` file with all the translation keys
3. Update the `i18n.js` file to include the new language
4. If the language is RTL, update the RTL detection logic in `LanguageContext.js`

## Best Practices

1. Use translation keys instead of hardcoded strings
2. Organize translation keys hierarchically (e.g., `navbar.dashboard`, `settings.language`)
3. Use the `LocalizedLink` component for links that need to adapt to the current language
4. Test your UI in both LTR and RTL languages
5. Ensure all components work well on mobile devices

## Language Detection

The application automatically detects the user's preferred language using:

1. Previously saved language preference in localStorage
2. Browser language settings
3. Default to English if no preference is detected

This logic is implemented in the `useLanguageDetection` hook.
