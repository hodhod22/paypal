import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPayout } from "../features/stripeSlice"; // Assuming you have actions for both payout types
import { toast } from "react-toastify";

const Payout = () => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [iban, setIban] = useState("DE89370400440532013000");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.loginAuth);
  const userId = localStorage.getItem("userId");
  const handlePayout = async (e) => {
    e.preventDefault();

    if (!amount || !currency || !iban) {
      toast.error("Please fill all fields");
      return;
    }

    const payoutData = {
      userId,
      amount: parseFloat(amount),
      currency,
      iban,
    };

    try {
      // Use the Stripe payout system
      await dispatch(createPayout(payoutData)).unwrap();
      toast.success("Payout successful!");
    } catch (error) {
      toast.error(`Payout failed: ${error.message}`);
    }
  };

  return (
    <div className="text-center text-white">
      <h2>Request Payout</h2>
      <p>Iban example for different currencies</p>
      <p>EUR: DE89370400440532013000</p>
      <p>GBP: GB33BUKB20201555555555</p>
      <p> USD: US123456789</p>
      <form onSubmit={handlePayout} className="m-2">
        <div>
          <label>Amount</label>
          <input
            className="text-black m-2"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Currency</label>
          <select
            className="text-black m-2"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required
          >
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <div>
          <label>IBAN</label>
          <input
            className="text-black m-2"
            type="text"
            value={iban}
            onChange={(e) => setIban(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="border-solid border-red-500 border-2 p-2 rounded"
        >
          Request Payout
        </button>
      </form>
    </div>
  );
};

export default Payout;
