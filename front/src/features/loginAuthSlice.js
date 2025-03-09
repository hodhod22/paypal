// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // User data
  isAuthenticated: false, // Authentication status
};

const loginAuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logoutSuccess } = loginAuthSlice.actions;
export default loginAuthSlice.reducer;
