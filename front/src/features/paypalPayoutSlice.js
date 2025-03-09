import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// API base URL
const API_BASE_URL = import.meta.env.DEV ? "http://localhost:5000" : "";

// Create PayPal payout
export const createPaypalPayout = createAsyncThunk(
  "paypalPayout/create",
  async (payoutData, { rejectWithValue }) => {
    try {
      // Handle validation error case
      if (payoutData.error) {
        return rejectWithValue(payoutData.error);
      }

      const response = await fetch(`${API_BASE_URL}/api/paypal/create-payout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payoutData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || "Failed to create payout");
      }

      return data;
    } catch (error) {
      console.error("Payout error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Check payout status
export const checkPayoutStatus = createAsyncThunk(
  "paypalPayout/checkStatus",
  async (batchId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/paypal/payout-status/${batchId}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || "Failed to check payout status");
      }

      return data;
    } catch (error) {
      console.error("Status check error:", error);
      return rejectWithValue(error.message);
    }
  }
);

const paypalPayoutSlice = createSlice({
  name: "paypalPayout",
  initialState: {
    loading: false,
    error: null,
    currentPayout: null,
    payoutStatus: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPayoutStatus: (state) => {
      state.payoutStatus = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create payout cases
      .addCase(createPaypalPayout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaypalPayout.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayout = action.payload;
        state.error = null;
      })
      .addCase(createPaypalPayout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Check status cases
      .addCase(checkPayoutStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkPayoutStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.payoutStatus = action.payload.batch_header?.batch_status;
        state.error = null;
      })
      .addCase(checkPayoutStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearError, clearPayoutStatus, setError } =
  paypalPayoutSlice.actions;
export default paypalPayoutSlice.reducer;
