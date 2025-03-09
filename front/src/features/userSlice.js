import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchWithdrawalHistory = createAsyncThunk(
  "user/fetchWithdrawalHistory",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/user/withdrawal-history/${userId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    withdrawalHistory: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWithdrawalHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWithdrawalHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.withdrawalHistory = action.payload;
      })
      .addCase(fetchWithdrawalHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export default userSlice.reducer;
