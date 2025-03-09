import React, { useEffect } from "react";

const PayPalButton = ({ amount, currency, userId }) => {
  useEffect(() => {
    // Dynamically load the PayPal SDK script
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=ATb3kenhg-uDCl0tKspFs_FYBRtxT5wJfyAz0IwlpiE_XhbTHHWAvySBPHaawKV_68x27hP7w3jdxqs1&currency=${currency}`;
    script.async = true;
    script.onload = () => {
      // Render the PayPal button after the script is loaded
      window.paypal
        .Buttons({
          createOrder: async (data, actions) => {
            try {
              const response = await fetch("/api/paypal/create-paypal-order", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount, currency, userId }),
              });
              const order = await response.json();
              return order.id;
            } catch (error) {
              console.error("Error creating PayPal order:", error);
            }
          },
          onApprove: async (data, actions) => {
            try {
              const response = await fetch("/api/paypal/capture-paypal-order", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ orderID: data.orderID, userId }),
              });
              const captureData = await response.json();
              console.log("Payment successful:", captureData);
              alert("Payment successful!");
            } catch (error) {
              console.error("Error capturing PayPal order:", error);
            }
          },
          onError: (err) => {
            console.error("PayPal error:", err);
            alert("Payment failed. Please try again.");
          },
        })
        .render("#paypal-button-container");
    };
    document.body.appendChild(script);

    // Cleanup function to remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, [amount, currency, userId]);

  return <div id="paypal-button-container"></div>;
};

export default PayPalButton;
