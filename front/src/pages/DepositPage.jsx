import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector } from "react-redux";

import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51Q1V7o08xjp21WbBT1O4Lq1f5Y3vIPLkIMNNLy8x6QtGeoPoaiGmuMzIIUh9rgwXQxy5UTTekEcx40HnrdYzlEmF00rrDMQ3Kl"
);
import api from "../api/api";
const DepositForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");

  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/payments/deposit", {
        amount,
        currency,
      });
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        alert(`Payment failed: ${result.error.message}`);
      } else {
        await api.post("/payments/confirm-deposit", {
          amount,
          currency,
        });
        alert("Deposit successful!");
      }
    } catch (error) {
      console.error("Deposit failed:", error);
      alert("Deposit failed. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleDeposit}
      className="max-w-md mx-auto p-6 bg-white rounded shadow"
    >
      <h2 className="text-2xl font-bold mb-4">Deposit Money</h2>
      <div className="mb-4">
        <label className="block mb-2">Amount</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Currency</label>
        <select
          className="w-full p-2 border rounded"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="USD">USD</option>
          <option value="GBP">GBP</option>
          <option value="EUR">EUR</option>
          <option value="IRR">IRR</option>
        </select>
      </div>
      <div className="mb-4">
        <CardElement className="p-2 border rounded" />
      </div>
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        disabled={!stripe}
      >
        Deposit
      </button>
    </form>
  );
};

const DepositPage = ({ userId }) => (
  <Elements stripe={stripePromise}>
    <DepositForm userId={userId} />
  </Elements>
);

export default DepositPage;
