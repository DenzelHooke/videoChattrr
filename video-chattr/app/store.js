import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import roomReducer from "../features/room/roomSlice";
import usersReducer from "../features/users/usersSlice";
import utilsReducer from "../features/utils/utilsSlice";

import { createWrapper } from "next-redux-wrapper";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      room: roomReducer,
      users: usersReducer,
      utils: utilsReducer,
    },
  });

export const wrapper = createWrapper(makeStore);
