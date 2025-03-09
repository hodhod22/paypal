import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateRates } from "../features/account/accountSlice";
import axios from "axios";

const LiveCurrencyRates = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const rates = useSelector((state) => state.account.rates);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get(
          "https://v6.exchangerate-api.com/v6/1fc8d54487c6fe916e3bd668/latest/USD"
        );
        dispatch(updateRates(response.data.conversion_rates));
        setError(null);
      } catch (err) {
        console.error("Failed to fetch currency rates:", err);
        setError("Could not fetch live rates. Please try again later.");
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 60000); // Update rates every 60 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [dispatch]);

  return (
    <div className="text-white  p-4 text-lg rounded outline-teal-500 outline-4 mb-2 border-[1px] shadow-inner  shadow-green-600  bg-[#00008B]">
      <h2 className="text-xl font-bold mb-4 text-center">
        Live Currency Rates
      </h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul>
          {rates &&
            Array.isArray(Object.keys(rates)) &&
            Object.keys(rates)?.map((currency) => (
              <li key={currency} className="flex justify-between py-2 border-b">
                <span>{currency}</span>
                <span>{rates[currency]}</span>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default LiveCurrencyRates;
