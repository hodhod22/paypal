import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaHome,
  FaUsers,
  FaSignOutAlt,
  FaSignInAlt,
  FaMoneyBillWave,
  FaCog,
  FaBell,
  FaCalendarAlt,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaGlobe,
  FaUserCircle,
} from "react-icons/fa";
import { logoutSuccess } from "../features/loginAuthSlice";
import { useLanguage } from "../contexts/LanguageContext";
import i18n from "i18next";

const Navbar = () => {
  const dispatch = useDispatch();
  const [showLanguageSwitcher, setShowLanguageSwitcher] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const role = useSelector((state) => state.auth.role);
  const { t } = useTranslation();
  const { isRTL, currentLanguage } = useLanguage();
  const { isAuthenticated } = useSelector((state) => state.loginAuth);

  const languageSwitcherRef = useRef(null);
  const settingsMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        languageSwitcherRef.current &&
        !languageSwitcherRef.current.contains(event.target)
      ) {
        setShowLanguageSwitcher(false);
      }
      if (
        settingsMenuRef.current &&
        !settingsMenuRef.current.contains(event.target)
      ) {
        setShowSettingsMenu(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(event.target)
      ) {
        setShowMobileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowMobileMenu(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleLanguageSwitcher = (e) => {
    e.stopPropagation();
    console.log(
      "Language switcher toggled, current state:",
      !showLanguageSwitcher
    );
    setShowLanguageSwitcher(!showLanguageSwitcher);
    setShowSettingsMenu(false);
  };

  const toggleSettingsMenu = (e) => {
    e.stopPropagation();
    setShowSettingsMenu(!showSettingsMenu);
    setShowLanguageSwitcher(false);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    setShowSettingsMenu(false);
    setShowLanguageSwitcher(false);
  };

  const handleLogout = () => {
    // Dispatch logout action
    dispatch(logoutSuccess());
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    dispatch((state) => (state.auth = null));
    // Optionally, redirect to the login page
    window.location.href = "/login";
  };

  // Determine font class based on language
  const fontClass = isRTL() ? "font-ar font-fa" : "";

  // Navigation links
  const navLinks = [
    {
      to: "/dashboard",
      title: "navbar.dashboard",
      icon: <FaHome />,
      show: true,
    },
  ];

  // Get language emoji
  const getLanguageEmoji = (code) => {
    const flags = {
      en: "🇬🇧",
      sv: "🇸🇪",
      fa: "🇮🇷",
      ar: "🇸🇦",
      tr: "🇹🇷",
    };
    return flags[code] || "🌐";
  };

  // Debug information
  console.log("Current language:", currentLanguage);
  console.log("Is RTL:", isRTL());
  console.log("Language switcher visible:", showLanguageSwitcher);

  // Direct language change function that doesn't rely on context
  const directLanguageChange = (code) => {
    console.log("Direct language change to:", code);
    try {
      // Get language direction
      const dir = code === "ar" || code === "fa" ? "rtl" : "ltr";

      // Change the language in i18next
      i18n.changeLanguage(code);

      // Update the document language and direction
      document.documentElement.lang = code;
      document.documentElement.dir = dir;

      // Add RTL class if needed
      if (dir === "rtl") {
        //document.documentElement.classList.add("rtl");
        document.body.classList.add("rtl");

        // Fix for RTL layout shift
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.overflowX = "hidden";
        document.body.style.transform = "none";
      } else {
        document.documentElement.classList.remove("rtl");
        document.body.classList.remove("rtl");

        // Reset styles
        document.body.style.margin = "";
        document.body.style.padding = "";
        document.body.style.overflowX = "";
        document.body.style.transform = "";
      }

      // Store the language preference
      localStorage.setItem("i18nextLng", code);

      console.log("Language changed directly to:", code);

      // Close menus
      setShowLanguageSwitcher(false);
      setShowMobileMenu(false);
    } catch (error) {
      console.error("Error in direct language change:", error);
    }
  };

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      console.log("Language change event detected in Navbar");
      // Force a re-render by updating a state
      setShowLanguageSwitcher(false);
    };

    document.addEventListener("languageChanged", handleLanguageChange);
    return () => {
      document.removeEventListener("languageChanged", handleLanguageChange);
    };
  }, []);

  return (
    <nav
      className={`bg-green-500 text-white py-3 px-5 md:px-8 ${fontClass} shadow-md sticky top-0 z-50`}
    >
      <div className="container mx-auto flex justify-between items-center relative">
        {/* Logo/Title */}
        <Link
          to="/"
          className="text-xl text-[#d65076] font-extrabold flex-shrink-0"
        >
          {t("navbar.sendMoney")}
        </Link>

        <div className="flex items-center">
          {/* Language Switcher - Visible on all screen sizes */}
          <div className="relative mr-3" ref={languageSwitcherRef}>
            <button
              onClick={toggleLanguageSwitcher}
              className="flex items-center justify-center w-10 h-10 bg-green-600 hover:bg-green-700 rounded-full transition-colors"
              title={t("navbar.language")}
              aria-expanded={showLanguageSwitcher}
              aria-haspopup="true"
            >
              <span className="text-xl text-white">
                {currentLanguage ? (
                  getLanguageEmoji(currentLanguage)
                ) : (
                  <FaGlobe />
                )}
              </span>
            </button>

            {showLanguageSwitcher && (
              <div
                className={`absolute top-full ${
                  isRTL() ? "left-0" : "right-0"
                } mt-2 z-50 bg-white p-3 rounded-lg shadow-lg border border-gray-300`}
                style={{
                  minWidth: "200px",
                  maxWidth: "90vw",
                  transform: "none",
                  right: isRTL() ? "auto" : "0",
                  left: isRTL() ? "0" : "auto",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-gray-800 font-bold mb-2">
                  {t("navbar.language")}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {["en", "sv", "fa", "ar", "tr"].map((lang) => {
                    const isActive = currentLanguage === lang;
                    const langName = {
                      en: "English",
                      sv: "Svenska",
                      fa: "فارسی",
                      ar: "العربية",
                      tr: "Türkçe",
                    }[lang];
                    const flag = getLanguageEmoji(lang);

                    return (
                      <button
                        key={lang}
                        onClick={() => {
                          console.log("Language button clicked:", lang);
                          directLanguageChange(lang);
                        }}
                        className={`flex items-center p-2 rounded ${
                          isActive
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        <span
                          className={`text-xl ${isRTL() ? "ml-2" : "mr-2"}`}
                        >
                          
                        </span>
                        <span className="font-medium">{langName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={mobileMenuButtonRef}
            id="mobile-menu-button"
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label={showMobileMenu ? "Close menu" : "Open menu"}
          >
            {showMobileMenu ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
          {/* Dashboard Link */}
          <Link
            to="/dashboard"
            className="flex items-center px-2 py-1 hover:bg-green-600 rounded transition-colors"
            title={t("navbar.dashboard")}
          >
            <span className={`text-lg ${isRTL() ? "ml-2" : "mr-2"}`}>
              <FaHome />
            </span>
            <span className="hidden lg:inline whitespace-nowrap">
              {t("navbar.dashboard")}
            </span>
          </Link>

          {/* Profile Link - Only shown when logged in */}
          {isAuthenticated && (
            <Link
              to="/profile"
              className="flex items-center px-2 py-1 hover:bg-green-600 rounded transition-colors"
              title={t("navbar.profile")}
            >
              <span className={`text-lg ${isRTL() ? "ml-2" : "mr-2"}`}>
                <FaUserCircle />
              </span>
              <span className="hidden lg:inline whitespace-nowrap">
                {t("navbar.profile")}
              </span>
            </Link>
          )}

          {/* Auth Button */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 rounded transition-colors"
                title={t("navbar.logout")}
              >
                <span className={`text-lg ${isRTL() ? "ml-2" : "mr-2"}`}>
                  <FaSignOutAlt />
                </span>
                <span className="hidden lg:inline">{t("navbar.logout")}</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                title={t("navbar.login")}
              >
                <span className={`text-lg ${isRTL() ? "ml-2" : "mr-2"}`}>
                  <FaSignInAlt />
                </span>
                <span className="hidden lg:inline">{t("navbar.login")}</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black bg-opacity-50 mobile-menu-backdrop"
              onClick={() => setShowMobileMenu(false)}
            ></div>
            <div
              ref={mobileMenuRef}
              className={`fixed inset-0 z-50 ${
                isRTL() ? "right-0" : "left-0"
              } top-16 bg-green-500 p-4 w-64 h-screen overflow-y-auto md:hidden mobile-menu`}
            >
              <div className="flex flex-col space-y-4">
                {/* Dashboard in Mobile Menu */}
                <Link
                  to="/dashboard"
                  className="flex items-center px-4 py-2 hover:bg-green-600 rounded transition-colors mobile-menu-item mobile-touch-target"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <span
                    className={`text-lg ${
                      isRTL() ? "mobile-icon-right" : "mobile-icon-left"
                    } ${isRTL() ? "ml-3" : "mr-3"}`}
                  >
                    <FaHome />
                  </span>
                  <span className="mobile-text-base">
                    {t("navbar.dashboard")}
                  </span>
                </Link>

                {/* Profile Link in Mobile Menu - Only shown when logged in */}
                {isAuthenticated && (
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 hover:bg-green-600 rounded transition-colors mobile-menu-item mobile-touch-target"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <span
                      className={`text-lg ${
                        isRTL() ? "mobile-icon-right" : "mobile-icon-left"
                      } ${isRTL() ? "ml-3" : "mr-3"}`}
                    >
                      <FaUserCircle />
                    </span>
                    <span className="mobile-text-base">
                      {t("navbar.profile")}
                    </span>
                  </Link>
                )}

                {/* Auth Button in Mobile Menu */}
                <div className="border-t border-green-400 pt-4 mobile-divider">
                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors mobile-touch-target"
                    >
                      <span
                        className={`text-lg ${
                          isRTL() ? "mobile-icon-right" : "mobile-icon-left"
                        } ${isRTL() ? "ml-3" : "mr-3"}`}
                      >
                        <FaSignOutAlt />
                      </span>
                      <span className="mobile-text-base">
                        {t("navbar.logout")}
                      </span>
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="flex items-center w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors mobile-touch-target"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <span
                        className={`text-lg ${
                          isRTL() ? "mobile-icon-right" : "mobile-icon-left"
                        } ${isRTL() ? "ml-3" : "mr-3"}`}
                      >
                        <FaSignInAlt />
                      </span>
                      <span className="mobile-text-base">
                        {t("navbar.login")}
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
