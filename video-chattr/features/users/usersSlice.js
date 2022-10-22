import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ─── App State ───────────────────────────────────────────────────────────────

const initialState = {
  friends: [],
};

// ─── Reducers ────────────────────────────────────────────────────────────────

const getUsers = createAsyncThunk(
  "users/getUsers",
  async (userData, config) => {
    try {
      return await usersService.getUsers(userData);
    } catch (error) {
      (error.message && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ─── Slice Reducers And Extra Reducers ───────────────────────────────────────

export const userSlice = createSlice({
  name: "userSettings",
  initialState: initialState,
});
