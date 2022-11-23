import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isError: false,
  isSuccess: false,
  message: "",
  push: "",
};

export const utilsSlice = createSlice({
  name: "utilities",
  initialState: initialState,
  reducers: {
    setError: (state, action) => {
      state.isError = true;
      state.message = action.payload.message;
      state.push = action.payload.push;
    },
    setSuccess: (state, action) => {
      state.isSuccess = true;
      state.message = action.payload.message;
      state.push = action.payload.push;
    },
    resetError: (state) => {
      state.isError = false;
      state.message = "";
      state.push = "";
    },
    resetSuccess: (state) => {
      state.isSuccess = false;
      state.message = "";
      state.push = "";
    },
  },
});

export const { setError, resetError, setSuccess, resetSuccess } =
  utilsSlice.actions;

export default utilsSlice.reducer;
