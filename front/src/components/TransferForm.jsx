import React, { useState } from "react";
import axios from "axios";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { useSelector } from "react-redux";
const TransferForm = () => {
  const { user } = useSelector((state) => state.auth);
  const [receiverAccountNumber, setReceiverAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");

  const handleTransfer = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/accounts/transfer",
        {
          senderId: user.id,
          receiverAccountNumber,
          amount: parseFloat(amount),
          currency,
        }
      );

      alert(response.data.message);
    } catch (error) {
      console.error("Transfer failed: ", error);
      alert(
        error.response.data.message || "Transfer failed. Please try again."
      );
    }
  };

  return (
    <div className="shadow-inner  shadow-yellow-300 p-6 bg-[#00008B] text-white  rounded outline-teal-500 outline-4 mb-2 border-[1px]">
      <h2 className="text-xl font-bold mb-4 text-center">
        <FaMoneyBillTransfer className="inline m-2 text-yellow-400" />
        Transfer Money
      </h2>
      <form onSubmit={handleTransfer}>
        <div className="mb-4">
          <label className="block mb-1">Receiver's Account Number</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded text-black"
            value={receiverAccountNumber}
            onChange={(e) => setReceiverAccountNumber(e.target.value)}
            placeholder="Reciver's account number"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Amount</label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded text-black"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            placeholder="amount"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 ">Currency</label>
          <select
            className="w-full px-3 py-2 border rounded text-black font-bold"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required
          >
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
            <option value="EUR">EUR</option>
            <option value="IRR">IRR</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Transfer
        </button>
      </form>
    </div>
  );
};

export default TransferForm;
