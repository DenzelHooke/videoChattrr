import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { createWrapper } from "next-redux-wrapper";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
  });

export const wrapper = createWrapper(makeStore);
