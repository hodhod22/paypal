import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import CheckoutForm from "./CheckoutForm";
const stripePromise = loadStripe(
  "pk_test_51Q1V7o08xjp21WbBT1O4Lq1f5Y3vIPLkIMNNLy8x6QtGeoPoaiGmuMzIIUh9rgwXQxy5UTTekEcx40HnrdYzlEmF00rrDMQ3Kl"
);

const Stripe = ({ orderId, price }) => {
  const [clientSecret, setClientSecret] = useState("");
  const apperance = {
    theme: "stripe",
  };
  const options = {
    apperance,
    clientSecret,
  };
  const create_payment = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/create-payment",
        { price },
        { withCredentials: true }
      );
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <div className="mt-4">
      {clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm orderId={orderId} />
        </Elements>
      ) : (
        <button
          onClick={create_payment}
          className=" w-full text-lg font-bold px-10 py-[10px] rounded hover:shadow-green-700/30 hover:shadow-lg bg-green-700 text-white"
        >
          Deposit
        </button>
      )}
    </div>
  );
};
export default Stripe;
