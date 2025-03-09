// src/features/price/priceSlice.js
import { createSlice } from "@reduxjs/toolkit";

const priceReducer = createSlice({
  name: "price",
  initialState: { price: 100 },
  reducers: {
    setPrices: (state, action) => {
      state.price = action.payload;
    },
    removePrice: (state) => {
      state.price = 100;
    },
  },
});

export const { setPrices, removePrice } = priceReducer.actions;
export default priceReducer.reducer;
