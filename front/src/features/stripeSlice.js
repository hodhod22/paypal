import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const backendUrl = "http://localhost:5000";
// Stripe Payout
export const createPayout = createAsyncThunk(
  "stripe/createPayout",
  async (payoutData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/stripe/create-payout`,
        payoutData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const stripeSlice = createSlice({
  name: "stripe",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPayout.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPayout.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPayout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default stripeSlice.reducer;
