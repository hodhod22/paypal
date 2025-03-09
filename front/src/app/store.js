// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import accountReducer from "../features/account/accountSlice";
import priceReducer from "../features/price/priceReducer";
import accountReducers from "../features/accountNum/accountReducers";
import currencyReducer from "../features/currency/currencySlice";
import payoutReducer from "../features/payoutSlice";
import adminReducer from "../features/adminSlice";
import userReducer from "../features/userSlice";
import stripeSlice from "../features/stripeSlice";
import loginAuthSlice from "../features/loginAuthSlice";
import paypalPayoutReducer from "../features/paypalPayoutSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    account: accountReducer,
    price: priceReducer,
    accountNum: accountReducers,
    currency: currencyReducer,
    payout: payoutReducer,
    admin: adminReducer,
    user: userReducer,
    stripe: stripeSlice,
    loginAuth: loginAuthSlice,
    paypalPayout: paypalPayoutReducer,
  },
});
