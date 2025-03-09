import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const ZarinpalCallback = () => {
  const [isVerified, setIsVerified] = useState(false); // Prevent duplicate calls
  const [isLoading, setIsLoading] = useState(true); // Show loader during verification
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const authority = queryParams.get("Authority");
  const status = queryParams.get("Status");
  const userId = localStorage.getItem("userId"); // Retrieve the userId from local storage or Redux
  const currency = "IRR"; // Set your currency
  let data;
  useEffect(() => {
    const verifyPayment = async () => {
      // If already verified, stop execution
      if (isVerified) return;

      // Prevent unnecessary retries
      if (!authority || !status) {
        alert("Invalid callback parameters. Payment failed.");
        return;
      }

      if (status !== "OK") {
        alert("Payment was not successful.");
        return;
      }

      try {
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        if (!token) {
          alert("Unauthorized. Please log in.");
          return;
        }
        const response = await fetch(
          `http://localhost:5000/api/payments/zarinpal/callback?Authority=${authority}&Status=${status}`,
          {
            method: "GET", // Specify the HTTP method
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        );

        if (!response.ok) {
          // Handle errors
          const errorData = await response.json();
          console.error("Error verifying payment:", errorData);
          alert("Payment verification failed.");
          return;
        }

        data = await response.json();
        localStorage.setItem("datas", JSON.stringify(data));
        console.log("Payment verification success:", data);
        setIsVerified(true); // Mark payment as verified to prevent re-run

        alert("Payment verified successfully!");
        window.history.replaceState({}, document.title, "/dashboard");
      } catch (error) {
        console.error("Error during payment verification:", error);
        alert("An error occurred while verifying the payment.");
      } finally {
        setIsLoading(false); // Hide loader
      }
    };

    verifyPayment();
  }, [isVerified]);
  const datas = JSON.parse(localStorage.getItem("datas"));

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {isLoading ? (
        <div>Verifying payment...</div>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-4">Payment Status</h2>
          <div>
            <p>{datas.message}</p>
            <p>Status: {datas.status}</p>
            <p>Amount: {datas.amount} Toman</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ZarinpalCallback;
