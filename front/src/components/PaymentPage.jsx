import React from "react";
import PayPalButton from "./PaypalButton";
const PaymentPage = () => {
  const userId = localStorage.getItem("userId");
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pay with PayPal</h1>
      <PayPalButton amount="10.00" currency="USD" userId={userId} />
    </div>
  );
};

export default PaymentPage;
