import { configureStore } from "@reduxjs/toolkit";
import cohereReducer from "./features/cohereSlice";
import translationReducer from "./features/translateSlice";
export const store = configureStore({
  reducer: {
    cohere: cohereReducer,
    translation: translationReducer,
  },
});
