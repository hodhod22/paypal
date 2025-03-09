import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { requestPayout } from "../features/payoutSlice";
import { useLanguage } from "../contexts/LanguageContext";
import "../styles/rtl.css";

const PayoutForm = () => {
  const { t } = useTranslation();
  const { isRTL, currentLanguage } = useLanguage();
  const userId = localStorage.getItem("userId");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();
  const { paymentUrl, loading, error } = useSelector((state) => state.payout);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      requestPayout({
        amount,
        description: description || t("transactions.description"),
        callback_url: "http://localhost:5173/verify-payout",
        mobile: "1234567890",
        email: "user@example.com",
        userId, // Replace with actual user ID
      })
    );
  };

  return (
    <div
      className={` p-4 ${isRTL() ? "rtl-form" : ""} ${getLanguageFontClass()}`}
    >
      <h2 className="text-xl font-bold mb-4">{t("payouts.requestPayout")}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-white mb-1"
          >
            {t("payouts.payoutAmount")}
          </label>
          <input
            id="amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`p-2 border rounded w-full ${
              isRTL() ? "text-right" : "text-left"
            }`}
            dir="ltr" // Numbers are always LTR
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-white mb-1"
          >
            {t("transactions.description")}
          </label>
          <textarea
            id="description"
            placeholder={t("transactions.description")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`p-2 border rounded w-full ${
              isRTL() ? "text-right" : "text-left"
            }`}
            dir={isRTL() ? "rtl" : "ltr"}
            rows="2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="p-2 bg-blue-500 text-white rounded w-full"
        >
          {loading ? t("payouts.processing") : t("payouts.requestPayout")}
        </button>
      </form>

      {error && (
        <p
          className={`text-red-500 mt-2 ${
            isRTL() ? "text-right" : "text-left"
          }`}
        >
          {error}
        </p>
      )}

      {paymentUrl && (
        <div className={`mt-4 ${isRTL() ? "text-right" : "text-left"}`}>
          <a href={paymentUrl} className="text-blue-500 underline">
            {t("payments.proceedToPayment")}
          </a>
        </div>
      )}
    </div>
  );
};

export default PayoutForm;
