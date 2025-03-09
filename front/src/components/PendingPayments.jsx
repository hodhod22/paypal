import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingPayments } from "../features/adminSlice";

const PaymentsHistories = () => {
  const dispatch = useDispatch();
  const { pendingPayments, loading, error } = useSelector(
    (state) => state.admin
  );
  useEffect(() => {
    dispatch(fetchPendingPayments());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pending Payments</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">User</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Currency</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(pendingPayments) &&
            pendingPayments?.map((payment) => (
              <tr key={payment.authority} className="border-b">
                <td className="p-2">{payment.userName}</td>
                <td className="p-2">{payment.amount}</td>
                <td className="p-2">{payment.currency}</td>
                <td className="p-2">{payment.status}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentsHistories;
