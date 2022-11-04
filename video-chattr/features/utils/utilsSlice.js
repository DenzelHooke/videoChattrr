import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  isError: false,
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
    resetError: (state) => {
      state.isError = false;
      state.message = "";
      state.push = "";
    },
  },
});

export const { setError, resetError } = utilsSlice.actions;

export default utilsSlice.reducer;
