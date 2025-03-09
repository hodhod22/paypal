// src/features/account/currencySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const convertCurrency = createAsyncThunk(
  "currency/convertCurrency",
  async ({ userId, fromCurrency, toCurrency, amount }, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/currencies/convert",
        {
          userId,
          fromCurrency,
          toCurrency,
          amount,
        }
      );
      return response.data.balance;
    } catch (error) {
      console.error("Currency conversion failed:", error.message);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const currencyReducer = createSlice({
  name: "currency",
  initialState: {
    balance: { USD: 0, GBP: 0, EUR: 0, IRR: 0 },
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(convertCurrency.pending, (state) => {
        state.status = "loading";
      })
      .addCase(convertCurrency.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.balance = action.payload; // Update balance with new values
      })
      .addCase(convertCurrency.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.error || "Failed to convert currency.";
      });
  },
});

export default currencyReducer.reducer;
