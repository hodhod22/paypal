import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import i18next from "i18next";

const backendUrl = "http://localhost:5000";

export const requestPayout = createAsyncThunk(
  "payout/requestPayout",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/request-payout`,
        payload
      );
      return response.data;
    } catch (error) {
      // Extract error code if available, otherwise use the message
      const errorData = error.response?.data || {};
      return rejectWithValue({
        code: errorData.code || "unknown.error",
        message: errorData.message || i18next.t("errors.serverError"),
      });
    }
  }
);

// Verify Payout Action
export const verifyPayout = createAsyncThunk(
  "payout/verifyPayout",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backendUrl}/api/verify-payout`, {
        params: payload,
      });
      return response.data;
    } catch (error) {
      // Extract error code if available, otherwise use the message
      const errorData = error.response?.data || {};
      return rejectWithValue({
        code: errorData.code || "unknown.error",
        message: errorData.message || i18next.t("errors.serverError"),
      });
    }
  }
);

const payoutSlice = createSlice({
  name: "payout",
  initialState: {
    paymentUrl: null,
    loading: false,
    error: null,
    errorCode: null,
    verificationStatus: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.errorCode = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestPayout.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.errorCode = null;
      })
      .addCase(requestPayout.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentUrl = action.payload.paymentUrl;
      })
      .addCase(requestPayout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.errorCode = action.payload.code;
      })
      // Verify Payout
      .addCase(verifyPayout.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.errorCode = null;
      })
      .addCase(verifyPayout.fulfilled, (state, action) => {
        state.loading = false;
        state.verificationStatus = action.payload.message;
      })
      .addCase(verifyPayout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.errorCode = action.payload.code;
      });
  },
});

export const { clearError } = payoutSlice.actions;
export default payoutSlice.reducer;
