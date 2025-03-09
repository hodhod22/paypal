// src/components/ZarinpalPayment.js
import React, { useState } from "react";

const ZarinpalPayment = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    let amount = 10000;
    localStorage.setItem("amount", amount);
    
    try {
      const response = await fetch(
        "http://localhost:5000/api/payments/zarinpal",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: parseInt(amount), // Amount in Toman
            description: "Payment for order #1234",
            callbackUrl: "http://localhost:5173/zarinpal-callback", // Your callback URL
          }),
        }
      );

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Zarinpal payment page
      } else {
        alert("Payment request failed.");
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <button
        onClick={handlePayment}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay with Zarinpal"}
      </button>
    </div>
  );
};

export default ZarinpalPayment;
