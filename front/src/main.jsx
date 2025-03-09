import React, { Suspense, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./index.css";
import "./styles/rtl.css";
import "./styles/fonts.css"; // Import fonts
import "./styles/navbar.css"; // Import navbar styles
import "./styles/mobile.css"; // Import mobile styles
import "./i18n"; // Import i18n configuration
import { LanguageProvider } from "./contexts/LanguageContext";

// Set initial language and direction
const savedLanguage = localStorage.getItem("i18nextLng") || "en";
const isRTL = savedLanguage === "ar" || savedLanguage === "fa";
document.documentElement.lang = savedLanguage;
document.documentElement.dir = isRTL ? "rtl" : "ltr";

// Add a loading component
const LoadingFallback = () => (
  <div
    className="loading-container"
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw",
      backgroundColor: "#f9fafb",
    }}
  >
    <div
      className="loading-spinner"
      style={{
        border: "4px solid rgba(0, 0, 0, 0.1)",
        borderLeft: "4px solid #3b82f6",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        animation: "spin 1s linear infinite",
      }}
    ></div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </Suspense>
    </Router>
  </Provider>
);
