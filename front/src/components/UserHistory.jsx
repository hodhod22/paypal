import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { fetchWithdrawalHistory } from "../features/userSlice";
import { useLanguage } from "../contexts/LanguageContext";
import LocalizedDate from "./LocalizedDate";
import LocalizedCurrency from "./LocalizedCurrency";

const UserHistory = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const dispatch = useDispatch();
  const { withdrawalHistory, loading, error } = useSelector(
    (state) => state.user
  );
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    dispatch(fetchWithdrawalHistory(userId));
  }, [dispatch, userId]);

  if (loading) return <p className="p-4">{t("common.loading")}</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className={`p-4 ${isRTL() ? "font-ar font-fa" : ""}`}>
      <h2 className="text-xl font-bold mb-4 text-center">
        {t("payouts.payoutHistory")}
      </h2>
      <table className="w-full border-collapse text-white">
        <thead>
          <tr className="bg-zinc-700 rounded">
            <th className="p-2">{t("transactions.amount")}</th>
            <th className="p-2">{t("transactions.status")}</th>
            <th className="p-2">{t("transactions.date")}</th>
            {/* <th className="p-2">{t("payouts.payoutMethod")}</th> */}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(withdrawalHistory) && withdrawalHistory.length > 0 ? (
            withdrawalHistory.map((withdrawal) => (
              <tr key={withdrawal._id} className="border-b">
                <td className="p-2">
                  <LocalizedCurrency
                    value={withdrawal.amount}
                    currency={withdrawal.currency || "USD"}
                  />
                </td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      withdrawal.status === "completed"
                        ? "bg-green-700"
                        : withdrawal.status === "pending"
                        ? "bg-yellow-700"
                        : "bg-red-700"
                    }`}
                  >
                    {t(`transactions.${withdrawal.status || "pending"}`)}
                  </span>
                </td>
                <td className="p-2">
                  <LocalizedDate date={withdrawal.date} />
                </td>
               {/*  <td className="p-2">
                  {withdrawal.payoutMethod
                    ? t(`payouts.${withdrawal.payoutMethod.toLowerCase()}`)
                    : t("common.na")}
                </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-4 text-center">
                {t("transactions.noTransactions")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserHistory;
