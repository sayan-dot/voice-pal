import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  apiResponces: "",
  loading: false,
  error: null,
};

export const getApiMessage = createAsyncThunk("getApiMessage", async (text) => {
  try {
    const response = await axios.request({
      method: "POST",
      url: "https://api.cohere.ai/v1/generate",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        // TODO: make the auth private
        authorization: `Bearer asvkXkifK1YZEpofQXr4NMGP3heeRMGOhieHiWwi`,
      },
      data: {
        max_tokens: 50, // changes the responce length
        truncate: "END",
        return_likelihoods: "NONE",
        prompt: text,
      },
    });
    return response.data;
  } catch (e) {
    alert(e);
  }
});

export const speechSlice = createSlice({
  name: "speech",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getApiMessage.pending, (state) => {
      state.loading = true;
      console.log("Pending...");
    });

    builder.addCase(getApiMessage.fulfilled, (state, action) => {
      state.loading = false;
      state.apiResponces = action.payload.generations[0].text;
      console.log("Fulfilled...");
      console.log(state.apiResponces);
    });

    builder.addCase(getApiMessage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      console.log("Rejected...");
    });
  },
});

export default speechSlice.reducer;
