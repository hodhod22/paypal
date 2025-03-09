import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import { formatCurrency } from "../utils/formatters";
import TransferForm from "../components/TransferForm";
import { useSelector } from "react-redux";
import Stripe from "../components/Stripe";
import CurrencyConverter from "./CurrencyConverter";
import LiveCurrencyRates from "../components/LiveCurrencyRates";
import ZarinpalPayment from "./../components/ZarinpalPayment";
import PayoutForm from "../components/PayoutForm";
import UserHistory from "../components/UserHistory";
import { FaMoneyCheckAlt, FaArrowLeft } from "react-icons/fa";
import { MdOutlineHistory } from "react-icons/md";
import { FaPlusCircle } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { MdCurrencyExchange } from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";
import { MdTrendingDown } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import PaymentPage from "../components/PaymentPage";
import PaypalPayoutForm from "../components/PaypalPayoutForm";
import LocalizedCurrency from "../components/LocalizedCurrency";
import WithdrawImage from '../assets/withdraw.png'
import { MdDashboardCustomize } from "react-icons/md";
import { FaPaypal } from "react-icons/fa";
const Dashboard = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const [price, setPrice] = useState(0);
  const [users, setUsers] = useState([]);
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showZarinpal, setShowZarinpal] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showExchange, setShowExchange] = useState(false);
  const [showRates, setShowRates] = useState(false);
  const [showDict, setShowDict] = useState(false);
  const user1 = useSelector((state) => state.auth.user);
  const userId = localStorage.getItem("userId");

  let response;
  let sender;
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        response = await axios.get("http://localhost:5000/api/auth/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error.message);
      }
    };

    fetchUsers();
  }, []);
  useEffect(() => {
    if (!user1) {
      navigate("/login", {
        replace: true,
      });
    }
  }, []);
  const handleChange = (e) => {
    if (e.target.value < 100) {
      setPrice(100);
      localStorage.setItem("thisPrice", 100);
    } else {
      setPrice(e.target.value);
      localStorage.setItem("thisPrice", parseInt(e.target.value));
    }
    sender = users.filter((user) => user.email === user1.email);

    localStorage.setItem("thisAccountnumber", sender[0].accountNumber);
  };
  return (
    <div
      className={`p-3 bg-[#00008B] w-screen min-h-screen pb-6 ${
        isRTL() ? "font-ar font-fa" : ""
      }`}
    >
      <div className="flex justify-center">
        <div className="">
          {!showWithdrawal ? (
            <button
              onClick={() => setShowWithdrawal(true)}
              className="m-5 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition duration-300"
              aria-label={t("payouts.requestPayout")}
            >
              <FaMoneyCheckAlt size={30} />
            </button>
          ) : (
            <div>
              <button
                onClick={() => setShowWithdrawal(false)}
                className="hover:text-gray-900 flex items-center mb-4 text-white"
              >
                <FaArrowLeft className="mr-2 text-white" />
                {t("common.back")}
              </button>
              <PayoutForm />
            </div>
          )}
          {!showHistory ? (
            <button
              onClick={() => setShowHistory(true)}
              className="m-5 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition duration-300"
              aria-label={t("transactions.title")}
            >
              <MdOutlineHistory size={30} />
            </button>
          ) : (
            <div className="">
              <button
                onClick={() => setShowHistory(false)}
                className="text-white hover:text-gray-900 flex items-center mb-4"
              >
                <FaArrowLeft className="mr-2" />
                {t("common.back")}
              </button>
              <UserHistory />
            </div>
          )}
          {!showDeposit ? (
            <button
              onClick={() => setShowDeposit(true)}
              className="m-5 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition duration-300"
              aria-label={t("dashboard.addMoney")}
            >
              <FaPaypal size={30} />
            </button>
          ) : (
            <div>
              <button
                onClick={() => setShowDeposit(false)}
                className="text-white hover:text-gray-900 flex items-center mb-4"
              >
                <FaArrowLeft className="mr-2" />
                {t("common.back")}
              </button>
              <div className="w-full rounded font-bold shadow-inner shadow-yellow-300 outline-teal-500 outline-4 mb-2 border-[1px] p-6">
                <PaymentPage />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center">
        <div>
          {!showZarinpal ? (
            <button
              onClick={() => setShowZarinpal(true)}
              className="m-5 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition duration-300"
              aria-label={t("payments.title")}
            >
              <MdPayment size={30} />
            </button>
          ) : (
            <div>
              <button
                onClick={() => setShowZarinpal(false)}
                className="hover:text-gray-900 flex items-center mb-4 text-white"
              >
                <FaArrowLeft className="mr-2 text-white" />
                {t("common.back")}
              </button>
              <ZarinpalPayment />
            </div>
          )}
          {!showUsers ? (
            <button
              onClick={() => setShowUsers(true)}
              className="m-5 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition duration-300"
              aria-label={t("profile.title")}
            >
              <MdDashboardCustomize size={30} />
            </button>
          ) : (
            <div>
              <button
                onClick={() => setShowUsers(false)}
                className="hover:text-gray-900 flex items-center mb-4 text-white"
              >
                <FaArrowLeft className="mr-2 text-white" />
                {t("common.back")}
              </button>
              {users.map((user) =>
                user.email === user1?.email ? (
                  <ul
                    key={user._id}
                    className="rounded shadow-inner shadow-yellow-300 bg-[#00008B] w-full text-white text-xl outline-teal-500 outline-4 mb-2 border-[1px]"
                  >
                    <h1 className="text-2xl font-bold mb-4 text-[#d65076] text-center pt-3">
                      {t("dashboard.title")}
                    </h1>
                    <div className="flex">
                      <li className="p-2 text-[#d65076]">
                        {t("profile.fullName")}
                      </li>
                      <li className="p-2">{user.name}</li>
                    </div>
                    <div className="flex">
                      <li className="p-2 text-[#d65076]">{t("auth.email")}</li>
                      <li className="p-2">{user.email}</li>
                    </div>
                    <div className="flex">
                      <li className="p-2 text-[#d65076]">
                        {t("dashboard.accountNumber")}
                      </li>
                      <li className="p-2">{user.accountNumber}</li>
                    </div>
                    <div className="flex">
                      <li className="p-2 text-[#d65076]">
                        {t("dashboard.balance")} (USD)
                      </li>
                      <li className="p-2">
                        <LocalizedCurrency
                          value={user.balance.USD}
                          currency="USD"
                        />
                      </li>
                    </div>
                    <div className="flex">
                      <li className="p-2 text-[#d65076]">
                        {t("dashboard.balance")} (GBP)
                      </li>
                      <li className="p-2">
                        <LocalizedCurrency
                          value={user.balance.GBP}
                          currency="GBP"
                        />
                      </li>
                    </div>
                    <div className="flex">
                      <li className="p-2 text-[#d65076]">
                        {t("dashboard.balance")} (EUR)
                      </li>
                      <li className="p-2">
                        <LocalizedCurrency
                          value={user.balance.EUR}
                          currency="EUR"
                        />
                      </li>
                    </div>
                    <div className="flex">
                      <li className="p-2 text-[#d65076]">
                        {t("dashboard.balance")} (IRR)
                      </li>
                      <li className="p-2">
                        <LocalizedCurrency
                          value={user.balance.IRR}
                          currency="IRR"
                        />
                      </li>
                    </div>
                  </ul>
                ) : (
                  ""
                )
              )}
            </div>
          )}
          {!showTransfer ? (
            <button
              onClick={() => setShowTransfer(true)}
              className="m-5 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition duration-300"
              aria-label={t("dashboard.sendMoney")}
            >
              <FaMoneyBillTransfer size={30} />
            </button>
          ) : (
            <div>
              <button
                onClick={() => setShowTransfer(false)}
                className="hover:text-gray-900 flex items-center mb-4 text-white"
              >
                <FaArrowLeft className="mr-2 text-white" />
                {t("common.back")}
              </button>
              <TransferForm />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center">
        <div className="">
          {!showExchange ? (
            <button
              onClick={() => setShowExchange(true)}
              className="m-5 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition duration-300"
            >
              <MdCurrencyExchange size={30} />
            </button>
          ) : (
            <div>
              <button
                onClick={() => setShowExchange(false)}
                className="hover:text-gray-900 flex items-center mb-4 text-white"
              >
                <FaArrowLeft className="mr-2 text-white" />
                Go Back
              </button>
              <div>
                <CurrencyConverter />
              </div>
            </div>
          )}
          {!showRates ? (
            <button
              onClick={() => setShowRates(true)}
              className="m-5 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition duration-300"
            >
              <FaExchangeAlt size={30} />
            </button>
          ) : (
            <div>
              <button
                onClick={() => setShowRates(false)}
                className="hover:text-gray-900 flex items-center mb-4 text-white"
              >
                <FaArrowLeft className="mr-2 text-white" />
                Go Back
              </button>
              <LiveCurrencyRates />
            </div>
          )}
          {!showDict ? (
            <button
              onClick={() => setShowDict(true)}
              className="m-5 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition duration-300"
            >
              <img src={WithdrawImage} alt="Withdraw Image" className="w-8" />
            </button>
          ) : (
            <div>
              <button
                onClick={() => setShowDict(false)}
                className="hover:text-gray-900 flex items-center mb-4 text-white"
              >
                <FaArrowLeft className="mr-2 text-white" />
                Go Back
              </button>
              <div className="text-center">
                <PaypalPayoutForm />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
