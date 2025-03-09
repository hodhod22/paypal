// src/features/account/accountSlice.js
import { createSlice } from "@reduxjs/toolkit";

const accountSlice = createSlice({
  name: "account",
  initialState: {
    balance: {
      USD: 0,
      GBP: 0,
      EUR: 0,
      IRR: 0, // Persian Rial
    },
    rates: {}, // Add a field to store the live rates
  },
  reducers: {
    deposit: (state, action) => {
      const { currency, amount } = action.payload;
      if (state.balance[currency] !== undefined) {
        state.balance[currency] += amount;
      }
    },
    withdraw: (state, action) => {
      const { currency, amount } = action.payload;
      if (
        state.balance[currency] !== undefined &&
        state.balance[currency] >= amount
      ) {
        state.balance[currency] -= amount;
      }
    },
    updateRates: (state, action) => {
      state.rates = action.payload; // Update rates in the Redux store
    },
  },
});

export const { deposit, withdraw, updateRates } = accountSlice.actions;
export default accountSlice.reducer;
