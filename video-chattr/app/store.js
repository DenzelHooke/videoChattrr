import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import roomReducer from "../features/room/roomSlice";
import { createWrapper } from "next-redux-wrapper";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      room: roomReducer,
    },
  });

export const wrapper = createWrapper(makeStore);
