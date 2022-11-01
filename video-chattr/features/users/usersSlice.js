import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import usersService from "./usersService";

// ─── App State ───────────────────────────────────────────────────────────────

const initialState = {
  friends: [],
  savedRooms: [],
  usersFound: [],
  isLoading: false,
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

export const getSavedRooms = createAsyncThunk(
  "users/getSavedRooms",
  async (data, thunkAPI) => {
    try {
      return await usersService.getSavedRooms(data);
    } catch (error) {
      console.error(error);
      const message =
        (error.message && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const unsaveRoom = createAsyncThunk(
  "users/unsaveRoom",
  async (data, thunkAPI) => {
    try {
      console.log(data);

      return await usersService.unsaveRoom(data);
    } catch (error) {
      console.error(error);
      const message =
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
      })
      .addCase(getSavedRooms.fulfilled, (state, action) => {
        console.log("SAVED ROOMS: ", action.payload.savedRooms);
        state.savedRooms = action.payload.savedRooms.map((item) => {
          return {
            value1: item.roomName,
            roomID: item.roomID,
          };
        });
        // state.savedRooms = [...state.savedRooms].push(action.payload);
      });
  },
});

export const { setResultVisibility } = userSlice.actions;

export default userSlice.reducer;
