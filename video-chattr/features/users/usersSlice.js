import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import usersService from "./usersService";

// ─── App State ───────────────────────────────────────────────────────────────

const initialState = {
  friends: [],
  usersFound: [],
  isFriendsLoading: false,
  isResultsVisible: false,
};

// ─── Reducers ────────────────────────────────────────────────────────────────

export const getUsers = createAsyncThunk(
  "users/getUsers",
  async (payload, thunkAPI) => {
    try {
      return await usersService.getUsers(payload);
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
  name: "users",
  initialState: initialState,
  reducers: {
    setResultVisibility: (state, action) => {
      state.isResultsVisible = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.fulfilled, (state, action) => {
        console.log("action: ", action);
        state.isFriendsLoading = false;
        state.usersFound = action.payload.users;
      })
      .addCase(getUsers.pending, (state) => {
        state.isFriendsLoading = true;
        state.isResultsVisible = true;
      });
  },
});

export const { setResultVisibility } = userSlice.actions;

export default userSlice.reducer;
