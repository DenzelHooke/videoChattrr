import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import usersService from "./usersService";

// ─── App State ───────────────────────────────────────────────────────────────

const initialState = {
  friends: [],
  savedRooms: [],
  friendRequests: [],
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

export const getIncomingFriendRequests = createAsyncThunk(
  "users/getIncomingFriendRequests",
  async (data, thunkAPI) => {
    try {
      return await usersService.getIncomingFriendRequests(data);
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
      // console.log(data);

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

export const deleteFriendRequest = createAsyncThunk(
  "users/deleteFriendRequest",
  async (data, thunkAPI) => {
    try {
      // console.log(data);

      return await usersService.deleteFriendRequest(data);
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

export const createFriend = createAsyncThunk(
  "users/createFriend",
  async (data, thunkAPI) => {
    try {
      // console.log(data);

      return await usersService.createFriend(data);
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

export const getFriends = createAsyncThunk(
  "users/getFriends",
  async (data, thunkAPI) => {
    try {
      // console.log(data);

      return await usersService.getFriends(data);
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

export const deleteFriend = createAsyncThunk(
  "users/deleteFriend",
  async (data, thunkAPI) => {
    try {
      // console.log(data);

      return await usersService.deleteFriend(data);
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
        state.isLoading = false;
        // console.log("action: ", action);
        state.isFriendsLoading = false;
        state.usersFound = action.payload.users;
      })
      .addCase(getUsers.pending, (state) => {
        state.isFriendsLoading = true;
        state.isResultsVisible = true;
      })
      .addCase(getSavedRooms.fulfilled, (state, action) => {
        state.isLoading = false;
        // console.log("SAVED ROOMS: ", action.payload.savedRooms);
        state.savedRooms = action.payload.savedRooms.map((item) => {
          return {
            roomName: item.roomName,
            roomID: item.roomID,
          };
        });

        // state.savedRooms = [...state.savedRooms].push(action.payload);
      })
      .addCase(getIncomingFriendRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.friendRequests = action.payload.friendRequests;
      })
      .addCase(deleteFriendRequest.fulfilled, (state, action) => {
        state.friendRequests = action.payload.friendRequests;
        state.isLoading = false;
      })
      .addCase(createFriend.fulfilled, (state, action) => {
        state.friends = action.payload.friends;
        state.isLoading = false;
        // Removes the old friend request
        state.friendRequests = state.friendRequests.filter((item) => {
          return item._id !== action.payload.friend;
        });
      })
      .addCase(getFriends.fulfilled, (state, action) => {
        state.friends = action.payload.friends;
        state.isLoading = false;
      })
      .addCase(deleteFriend.fulfilled, (state, action) => {
        state.friends = action.payload.friends;
        state.isLoading = false;
      });
  },
});

export const { setResultVisibility } = userSlice.actions;

export default userSlice.reducer;
