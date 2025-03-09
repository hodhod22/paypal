import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import { verifyPayout } from "../features/payoutSlice";
import "../styles/rtl.css";

const VerifyPayout = () => {
  const { t } = useTranslation();
  const { isRTL, currentLanguage } = useLanguage();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { verificationStatus, loading, error } = useSelector(
    (state) => state.payout
  );

  // Get language-specific font class
  const getLanguageFontClass = () => {
    switch (currentLanguage) {
      case "fa":
        return "font-fa";
      case "ar":
        return "font-ar";
      case "tr":
        return "font-tr";
      case "sv":
        return "font-sv";
      default:
        return "";
    }
  };

  useEffect(() => {
    const authority = searchParams.get("Authority");
    const status = searchParams.get("Status");

    if (authority && status) {
      dispatch(verifyPayout({ authority, status }));
    }
  }, [dispatch, searchParams]);

  // Text alignment class based on language direction
  const textAlignClass = isRTL() ? "text-right" : "text-left";

  return (
    <div
      className={`p-5 ${isRTL() ? "rtl-form" : ""} ${getLanguageFontClass()}`}
      dir={isRTL() ? "rtl" : "ltr"}
    >
      <h2 className={`text-xl font-bold mb-4 ${textAlignClass}`}>
        {t("payouts.verifyingPayout")}
      </h2>

      {loading && (
        <div
          className={`flex items-center ${
            isRTL() ? "flex-row-reverse space-x-reverse" : ""
          } space-x-2 mb-4`}
        >
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          <p className={isRTL() ? "mr-2" : "ml-2"}>
            {t("payouts.verificationInProgress")}
          </p>
        </div>
      )}

      {verificationStatus && (
        <div
          className={`bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 ${textAlignClass}`}
        >
          <p className="font-semibold">{t("payouts.verificationSuccess")}</p>
          <p>{verificationStatus}</p>
        </div>
      )}

      {error && (
        <div
          className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 ${textAlignClass}`}
        >
          <p className="font-semibold">{t("payouts.verificationFailed")}</p>
          <p>{error}</p>
        </div>
      )}

      <div className={`mt-6 ${isRTL() ? "text-right" : "text-left"}`}>
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded transition-colors"
        >
          {t("common.back")}
        </button>
      </div>
    </div>
  );
};

export default VerifyPayout;
