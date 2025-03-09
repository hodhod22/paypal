import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  createPaypalPayout,
  checkPayoutStatus,
  clearError,
  setError,
} from "../features/paypalPayoutSlice";
import { useLanguage } from "../contexts/LanguageContext";
import "../styles/rtl.css"; // Import RTL specific styles

const PaypalPayoutForm = () => {
  const { t } = useTranslation();
  const { isRTL, currentLanguage } = useLanguage();
  const userId = localStorage.getItem("userId");
  const [amount, setAmount] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("paypal");
  const [email, setEmail] = useState("");
  const [iban, setIban] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("USD");

  const dispatch = useDispatch();
  const { loading, error, currentPayout, payoutStatus } = useSelector(
    (state) => state.paypalPayout
  );

  // Clear any errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Poll for payout status when we have a current payout
  useEffect(() => {
    let statusCheckInterval;
    if (currentPayout?.batch_header?.payout_batch_id) {
      const checkStatus = () => {
        dispatch(checkPayoutStatus(currentPayout.batch_header.payout_batch_id));
      };

      // Check immediately
      checkStatus();

      // Then check every 5 seconds until we get a final status
      statusCheckInterval = setInterval(() => {
        if (
          payoutStatus === "SUCCESS" ||
          payoutStatus === "DENIED" ||
          payoutStatus === "FAILED"
        ) {
          clearInterval(statusCheckInterval);
        } else {
          checkStatus();
        }
      }, 5000);
    }

    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [currentPayout, payoutStatus, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields first
    if (!amount || parseFloat(amount) <= 0) {
      dispatch(setError(t("errors.invalidAmount")));
      return;
    }

    if (!payoutMethod) {
      dispatch(setError(t("errors.required")));
      return;
    }

    const method = payoutMethod.toLowerCase();
    const payoutData = {
      amount: parseFloat(amount),
      currency,
      payoutMethod: method,
      note: description || undefined,
      userId,
    };

    // Add method-specific data
    switch (method) {
      case "paypal":
        if (!email) {
          dispatch(setError(t("errors.required")));
          return;
        }
        payoutData.email = email.trim();
        break;
      case "bank":
        if (!iban || !recipientName) {
          dispatch(setError(t("errors.required")));
          return;
        }
        payoutData.iban = iban.trim();
        payoutData.recipientName = recipientName.trim();
        break;
      case "card":
        if (!cardNumber || !recipientName) {
          dispatch(setError(t("errors.required")));
          return;
        }
        payoutData.cardNumber = cardNumber.trim();
        payoutData.recipientName = recipientName.trim();
        break;
      default:
        dispatch(setError(t("errors.required")));
        return;
    }

    console.log("Submitting payout data:", payoutData);
    dispatch(createPaypalPayout(payoutData));
  };

  const handlePayoutMethodChange = (e) => {
    const method = e.target.value;
    setPayoutMethod(method ? method.toLowerCase() : "paypal");
  };

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

  const renderPayoutMethodFields = () => {
    switch (payoutMethod.toLowerCase()) {
      case "paypal":
        return (
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("payouts.paypalEmail")}
            </label>
            <input
              id="email"
              type="email"
              placeholder="recipient@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                isRTL() ? "text-right" : "text-left"
              }`}
              required
              dir={isRTL() ? "rtl" : "ltr"}
            />
          </div>
        );

      case "bank":
        return (
          <>
            <div>
              <label
                htmlFor="iban"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("payouts.iban")}
              </label>
              <input
                id="iban"
                type="text"
                placeholder={t("payouts.iban")}
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  isRTL() ? "text-right" : "text-left"
                }`}
                required
                dir={isRTL() ? "rtl" : "ltr"}
              />
            </div>
            <div>
              <label
                htmlFor="recipientName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("payouts.recipientName")}
              </label>
              <input
                id="recipientName"
                type="text"
                placeholder={t("profile.fullName")}
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  isRTL() ? "text-right" : "text-left"
                }`}
                required
                dir={isRTL() ? "rtl" : "ltr"}
              />
            </div>
          </>
        );

      case "card":
        return (
          <>
            <div>
              <label
                htmlFor="cardNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("payouts.cardNumber")}
              </label>
              <input
                id="cardNumber"
                type="text"
                placeholder={t("payouts.cardNumber")}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  isRTL() ? "text-right" : "text-left"
                }`}
                required
                dir="ltr" // Card numbers are always LTR
              />
            </div>
            <div>
              <label
                htmlFor="recipientName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("payouts.recipientName")}
              </label>
              <input
                id="recipientName"
                type="text"
                placeholder={t("profile.fullName")}
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  isRTL() ? "text-right" : "text-left"
                }`}
                required
                dir={isRTL() ? "rtl" : "ltr"}
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  // Get currency options based on language
  const getCurrencyOptions = () => {
    const options = [
      { value: "USD", label: "USD" },
      { value: "EUR", label: "EUR" },
      { value: "GBP", label: "GBP" },
    ];

    // Add language-specific currencies
    switch (currentLanguage) {
      case "fa":
        options.push({ value: "IRR", label: "IRR (ریال)" });
        break;
      case "tr":
        options.push({ value: "TRY", label: "TRY (₺)" });
        break;
      case "sv":
        options.push({ value: "SEK", label: "SEK (kr)" });
        break;
      case "ar":
        options.push({ value: "AED", label: "AED (د.إ)" });
        break;
      default:
        break;
    }

    return options;
  };

  return (
    <div
      className={`max-w-md mx-auto p-6 bg-white rounded-lg shadow-md ${
        isRTL() ? "rtl-form" : ""
      } ${getLanguageFontClass()}`}
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {t("payouts.title")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="payoutMethod"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("payouts.payoutMethod")}
          </label>
          <select
            id="payoutMethod"
            value={payoutMethod}
            onChange={handlePayoutMethodChange}
            className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              isRTL() ? "text-right" : "text-left"
            }`}
            dir={isRTL() ? "rtl" : "ltr"}
          >
            <option value="paypal">{t("payouts.paypal")}</option>
            <option value="bank">{t("payouts.bank")}</option>
            <option value="card">{t("payouts.card")}</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("payouts.payoutAmount")}
          </label>
          <div className={`flex ${isRTL() ? "flex-row-reverse" : ""}`}>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`flex-1 p-2 border border-gray-300 ${
                isRTL() ? "rounded-r-md text-right" : "rounded-l-md text-left"
              } focus:ring-blue-500 focus:border-blue-500`}
              required
              dir="ltr" // Numbers are always LTR
            />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={`p-2 border border-gray-300 ${
                isRTL() ? "rounded-l-md" : "rounded-r-md"
              } focus:ring-blue-500 focus:border-blue-500 bg-gray-50`}
              dir={isRTL() ? "rtl" : "ltr"}
            >
              {getCurrencyOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {renderPayoutMethodFields()}

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("transactions.description")}
          </label>
          <textarea
            id="description"
            placeholder={t("transactions.description")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              isRTL() ? "text-right" : "text-left"
            }`}
            rows="2"
            dir={isRTL() ? "rtl" : "ltr"}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {loading ? t("payouts.processing") : t("payouts.requestPayout")}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {currentPayout && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("payouts.payoutStatus")}:{" "}
            <span
              className={`font-bold ${
                payoutStatus === "SUCCESS"
                  ? "text-green-600"
                  : payoutStatus === "PENDING"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {payoutStatus || t("payouts.payoutPending")}
            </span>
          </h3>
          <p
            className={`text-sm text-gray-600 ${
              isRTL() ? "text-right" : "text-left"
            }`}
          >
            {t("payouts.payoutReference")}:{" "}
            {currentPayout.batch_header?.payout_batch_id}
          </p>
        </div>
      )}
    </div>
  );
};

export default PaypalPayoutForm;
