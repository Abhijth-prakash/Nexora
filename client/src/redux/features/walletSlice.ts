import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { WalletAPi } from "../../utils/api";
import type { GetWalletParams, getWalletResponse } from "../../utils/apiTypes";

type WalletState = {
  wallet: getWalletResponse | null;
  loading: boolean;
  error: string | null;
  isStale: boolean;
};

const initialState: WalletState = {
  wallet: null,
  loading: false,
  error: null,
  isStale: true,
};

// get wallet (with transactions, one page at a time)
export const getWallet = createAsyncThunk(
  "wallet/getWallet",

  async (params: GetWalletParams = {}, { rejectWithValue }) => {
    try {
      const response = await WalletAPi.getWallet(params);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error?.message ||
            "Failed to fetch wallet. Please try again."
        );
      }

      return rejectWithValue("Failed to fetch wallet. Please try again.");
    }
  }
);

const walletSlice = createSlice({
  name: "walletSlice",
  initialState,
  reducers: {
    // call this after a cancel/refund so the wallet is refetched
    markWalletStale: (state) => {
      state.isStale = true;
    },
    clearWallet: (state) => {
      state.wallet = null;
      state.error = null;
      state.isStale = true;
    },
  },
  extraReducers: (build) => {
    build
      // get wallet
      .addCase(getWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.wallet = action.payload;
        state.isStale = false;
      })

      .addCase(getWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { markWalletStale, clearWallet } = walletSlice.actions;
export default walletSlice.reducer;