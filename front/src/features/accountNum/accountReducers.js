// src/features/price/priceSlice.js
import { createSlice } from "@reduxjs/toolkit";

const accountReducers = createSlice({
  name: "accountNum",
  initialState: { accountN: "" },
  reducers: {
    setAccount: (state, action) => {
      state.accountN = action.payload;
    },
    removeAccount: (state) => {
      state.accountN = "";
    },
  },
});

export const { setAccount, removeAccount } = accountReducers.actions;
export default accountReducers.reducer;
