import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { requestPayout, clearError } from "../features/payoutSlice";
import LocalizedFormBuilder from "./LocalizedFormBuilder";
import LocalizedLink from "./LocalizedLink";
import { useLanguage } from "../contexts/LanguageContext";
import {
  isValidEmail,
  isValidIBAN,
  isValidCardNumber,
  isValidAmount,
  isValidName,
  formatCardNumber,
  formatIBAN,
} from "../utils/formValidation";
import "../styles/rtl.css";

const PayoutFormBuilder = () => {
  const { t } = useTranslation();
  const { isRTL, currentLanguage } = useLanguage();
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();
  const { paymentUrl, loading, error } = useSelector((state) => state.payout);

  // Form state
  const [payoutMethod, setPayoutMethod] = useState("paypal");
  const [formattedCardNumber, setFormattedCardNumber] = useState("");
  const [formattedIBAN, setFormattedIBAN] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [currency, setCurrency] = useState("USD");

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

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

    return options.map((option) => ({
      value: option.value,
      translationKey: option.label,
    }));
  };

  // Initial form values
  const initialValues = {
    payoutMethod: "paypal",
    amount: "",
    description: "",
    email: "",
    iban: "",
    recipientName: "",
    cardNumber: "",
    currency: "USD",
  };

  // Validation function
  const validateForm = (values) => {
    const errors = {};
    const { amount, email, iban, recipientName, cardNumber, payoutMethod } =
      values;

    // Validate amount for all methods
    if (!isValidAmount(amount, 0)) {
      errors.amount = "errors.invalidAmount";
    }

    // Validate method-specific fields
    if (payoutMethod === "paypal") {
      if (!email) {
        errors.email = "errors.required";
      } else if (!isValidEmail(email)) {
        errors.email = "errors.invalidEmail";
      }
    } else if (payoutMethod === "bank") {
      if (!iban) {
        errors.iban = "errors.required";
      } else if (!isValidIBAN(iban)) {
        errors.iban = "errors.invalidIban";
      }

      if (!isValidName(recipientName)) {
        errors.recipientName = "errors.required";
      }
    } else if (payoutMethod === "card") {
      if (!cardNumber) {
        errors.cardNumber = "errors.required";
      } else if (!isValidCardNumber(cardNumber.replace(/\s/g, ""))) {
        errors.cardNumber = "errors.invalidCardNumber";
      }

      if (!isValidName(recipientName)) {
        errors.recipientName = "errors.required";
      }
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = (formValues, { resetForm }) => {
    const {
      amount,
      description,
      email,
      iban,
      recipientName,
      cardNumber,
      payoutMethod,
      currency,
    } = formValues;

    const payoutData = {
      amount,
      description: description || t("payouts.requestPayout"),
      userId,
      payoutMethod,
      currency,
      callback_url: "http://localhost:5173/verify-payout",
    };

    // Add method-specific fields
    switch (payoutMethod) {
      case "paypal":
        payoutData.email = email.trim();
        break;
      case "bank":
        payoutData.iban = iban.trim();
        payoutData.recipientName = recipientName.trim();
        break;
      case "card":
        payoutData.cardNumber = cardNumber.trim();
        payoutData.recipientName = recipientName.trim();
        break;
      default:
        break;
    }

    dispatch(requestPayout(payoutData));
    setSuccessMessage("payouts.payoutSuccess");
    setShowSuccessMessage(true);

    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
      setSuccessMessage("");
    }, 5000);
  };

  // Custom field renderers
  const renderFormattedCardNumber = (props) => {
    return (
      <input
        {...props}
        type="text"
        value={formattedCardNumber}
        onChange={(e) => {
          const rawValue = e.target.value.replace(/\s/g, "");
          const formatted = formatCardNumber(rawValue);
          setFormattedCardNumber(formatted);
          props.onChange({
            target: {
              name: props.name,
              value: rawValue,
            },
          });
        }}
        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isRTL() ? "text-right" : "text-left"
        }`}
        dir="ltr" // Card numbers are always LTR
      />
    );
  };

  const renderFormattedIBAN = (props) => {
    return (
      <input
        {...props}
        type="text"
        value={formattedIBAN}
        onChange={(e) => {
          const rawValue = e.target.value.replace(/\s/g, "");
          const formatted = formatIBAN(rawValue);
          setFormattedIBAN(formatted);
          props.onChange({
            target: {
              name: props.name,
              value: rawValue,
            },
          });
        }}
        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isRTL() ? "text-right" : "text-left"
        }`}
        dir="ltr" // IBAN is always LTR
      />
    );
  };

  // Form configuration
  const formConfig = {
    title: "payouts.requestPayout",
    fields: [
      {
        type: "select",
        name: "payoutMethod",
        label: "payouts.payoutMethod",
        required: true,
        options: [
          { value: "paypal", translationKey: "payouts.paypal" },
          { value: "bank", translationKey: "payouts.bank" },
          { value: "card", translationKey: "payouts.card" },
        ],
        onChange: (e) => {
          setPayoutMethod(e.target.value);
          setFormattedCardNumber("");
          setFormattedIBAN("");
        },
      },
      {
        type: "number",
        name: "amount",
        label: "payouts.payoutAmount",
        placeholder: "0.00",
        required: true,
        min: 0,
        dir: "ltr", // Numbers are always LTR
      },
      {
        type: "select",
        name: "currency",
        label: "dashboard.currency",
        required: true,
        options: getCurrencyOptions(),
        onChange: (e) => {
          setCurrency(e.target.value);
        },
      },
      {
        type: "textarea",
        name: "description",
        label: "transactions.description",
        placeholder: "transactions.description",
        rows: 2,
        dir: isRTL() ? "rtl" : "ltr",
      },
      // PayPal fields
      {
        type: "email",
        name: "email",
        label: "payouts.paypalEmail",
        placeholder: "email@example.com",
        required: true,
        hidden: () => payoutMethod !== "paypal",
        dir: "ltr", // Email addresses are always LTR
      },
      // Bank fields
      {
        type: "custom",
        name: "iban",
        label: "payouts.iban",
        placeholder: "payouts.iban",
        required: true,
        hidden: () => payoutMethod !== "bank",
        render: renderFormattedIBAN,
      },
      {
        type: "text",
        name: "recipientName",
        label: "payouts.recipientName",
        placeholder: "profile.fullName",
        required: true,
        hidden: () => payoutMethod !== "bank" && payoutMethod !== "card",
        dir: isRTL() ? "rtl" : "ltr",
      },
      // Card fields
      {
        type: "custom",
        name: "cardNumber",
        label: "payouts.cardNumber",
        placeholder: "payouts.cardNumber",
        required: true,
        hidden: () => payoutMethod !== "card",
        render: renderFormattedCardNumber,
      },
    ],
    submitButton: {
      text: "payouts.requestPayout",
      loadingText: "payouts.processing",
    },
    onSubmit: handleSubmit,
    validate: validateForm,
    initialValues,
  };

  return (
    <div className={`${isRTL() ? "rtl-form" : ""} ${getLanguageFontClass()}`}>
      <LocalizedFormBuilder
        config={formConfig}
        loading={loading}
        error={error}
      />

      {showSuccessMessage && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {t(successMessage)}
        </div>
      )}

      {paymentUrl && (
        <div className="mt-4">
          <LocalizedLink
            href={paymentUrl}
            className="text-blue-500 hover:underline"
            translationKey="payments.proceedToPayment"
          />
        </div>
      )}
    </div>
  );
};

export default PayoutFormBuilder;
