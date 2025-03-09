import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { convertCurrency } from "../features/currency/currencySlice";
import { MdCurrencyExchange } from "react-icons/md";
const CurrencyConverter = () => {
  const dispatch = useDispatch();
  const { balance, status, error } = useSelector((state) => state.currency);
  const { user } = useSelector((state) => state.auth);

  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("GBP");
  const [amount, setAmount] = useState(10);

  const handleConvert = () => {
    if (!user) {
      alert("User not logged in.");
      return;
    }

    dispatch(
      convertCurrency({
        userId: user.id, // Pass userId from the logged-in user
        fromCurrency,
        toCurrency,
        amount: parseFloat(amount),
      })
    );
  };

  return (
    <div className=" p-4   rounded max-w-md mx-auto text-lg  outline-teal-500 outline-4 mb-2 border-[1px] shadow-inner  shadow-yellow-300  bg-[#00008B]">
      <h2 className="text-white text-2xl font-bold mb-4 text-center">
        <MdCurrencyExchange className="inline m-2" />
        Currency Converter
      </h2>
      <div className="mb-4 w-[90%] m-auto mr-5">
        <label className="block text-sm mb-2 text-white">From Currency</label>
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="w-full p-2  border rounded"
        >
          {Array.isArray(Object.keys(balance)) &&
            Object.keys(balance)?.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
        </select>
      </div>
      <div className="mb-4 w-[90%] m-auto mr-5">
        <label className="block text-sm mb-2 text-white">To Currency</label>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="w-full p-2 border rounded "
        >
          {Array.isArray(Object.keys(balance)) &&
            Object.keys(balance)?.map((currency) => (
              <option key={currency} value={currency} >
                {currency}
              </option>
            ))}
        </select>
      </div>
      <div className="mb-4 w-[90%] m-auto mr-5">
        <label className="block text-sm mb-2 text-white">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter amount"
        />
      </div>
      <button
        onClick={handleConvert}
        className="w-[90%] mr-5 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Convert
      </button>
      {status === "loading" && <p className="mt-4">Converting...</p>}
      {status === "succeeded" && (
        <div className="mt-4 p-4 bg-green-100 rounded text-green-700">
          Conversion successful! Check updated balance.
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 rounded text-red-700">{error}</div>
      )}
    </div>
  );
};

export default CurrencyConverter;
