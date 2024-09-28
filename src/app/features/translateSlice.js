import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  translatestFromText: "",
  translatestToText: "",
  translatedResponse:"",
  loading: false,
  errorMessage: null,
};
//  code to converet the input text to english
export const getRawPrompt = createAsyncThunk(
  "RawPrompt",
  async ({ text, fromText, toText }) => {
    console.log(text, fromText, toText);
    const responce = await axios.get(
      `https://api.mymemory.translated.net/get?q=${text}&langpair=${fromText}|${toText}`
    );
    console.log(responce.data);
    return responce.data;
  }
);

export const getResponcePrompt = createAsyncThunk(
  "ResponsePrompt",
  async ({ text, fromText, toText }) => {
    try{
      const responce = await axios.get(
        `https://api.mymemory.translated.net/get?q=${text}&langpair=${fromText}|${toText}`
      );
      console.log(responce.data);
      return responce.data;
    }catch(e){
      console.log(e)
      alert(e.message);
    }
    
  }
);

export const translationSlice = createSlice({
  name: "textTranslator",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getRawPrompt.pending, (state) => {
      state.loading = true;
      console.log("translation loading...");
    });
    builder.addCase(getRawPrompt.fulfilled, (state, { payload }) => {
      // if fullfilled it takes the data from the api and translates it to english
      state.loading = false;
      state.translatestFromText = payload.responseData.translatedText;
      console.log("translation done");
    });
    builder.addCase(getRawPrompt.rejected, (state, action) => {
      state.loading = false;
      (state.errorMessage = action.error.message),
        console.log("translation failed");
    });
    // responce data gets translated
    builder.addCase(getResponcePrompt.pending, (state) => {
      state.loading = true;
      console.log("response translation loading....");
    });
    builder.addCase(getResponcePrompt.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.translatedResponse = payload.responseData.translatedText;
      console.log("response translation fullfilled", payload.responseData.translatedText);
    });
    builder.addCase(getResponcePrompt.rejected, (state, action) => {
      state.loading = false;
      (state.errorMessage = action.error.message),
        console.log("translation failed");
    });
  },
});

export default translationSlice.reducer;
