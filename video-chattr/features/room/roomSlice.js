import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import roomService from "./roomService";

const runningOnServer = typeof window === "undefined";

let user = null;
let rtcToken = null;

//* only True if nextjs is completed doing SSR'ing.
if (!runningOnServer) {
  rtcToken = localStorage.getItem("rtcToken");
}

//*─── App State ──────────────────────────────────────────────────────────────────

const initialState = {
  roomName: null,
  roomID: null,
  mode: null,
  isHost: false,
  host: null,
  exists: null,
  isError: null,
  isSuccess: null,
  isLoading: null,
  message: "",
  rooms: [
    { roomName: "Rooooooooooom One" },
    { roomName: "Siege4TheBoyz" },
    { roomName: "cool Room" },
  ],
};

//* ─── Reducers ───────────────────────────────────────────────────────────────────

export const genRTC = createAsyncThunk(
  "room/getRTC",
  async (userData, thunkAPI) => {
    try {
      const res = await roomService.genRTC(userData);
      console.log(res.data);
      return JSON.stringify(res.data);
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

export const createRoom = createAsyncThunk(
  "room/createRoom",
  async (userData, thunkAPI) => {
    try {
      return await roomService.createRoom(userData);
    } catch (error) {
      const message =
        (error.message && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getRoomData = createAsyncThunk(
  "room/getRoomData",
  async (roomID, thunkAPI) => {
    try {
      return await roomService.getRoomData(roomID);
    } catch (error) {
      const message =
        (error.message && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getSavedRooms = createAsyncThunk(
  "room/getSavedRooms",
  async (userID, thunkAPI) => {
    try {
      return await roomService.getSavedRooms();
    } catch (error) {
      const message =
        (error.message && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

//* ─── Slice Reducers And Extra Reducers ──────────────────────────────────────────

export const roomSlice = createSlice({
  name: "room",
  initialState: initialState,
  reducers: {
    resetRoomState: (state) => {
      state.isLoading = null;
      state.isSuccess = null;
      state.isError = null;
      state.message = "";
      state.exists = null;
      state.host = null;
      state.mode = null;
      state.roomName = null;
      state.roomID = null;
    },
    setRoomName: (state, action) => {
      state.roomName = action.payload;
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    setRoomID: (state, action) => {
      state.roomID = action.payload;
    },
    setError: (state, action) => {
      state.isError = true;
      state.message = action.payload.message;
    },
    leave: (state, action) => {
      state.isHost = false;
    },
    roomExitCleanup: (state, action) => {
      state.rtcToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(genRTC.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(genRTC.fulfilled, (state) => {})
      .addCase(createRoom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        // state.isLoading = false;
        state.roomName = action.payload.roomName;
        state.roomID = action.payload.roomID;
        state.mode = "create";
      })
      .addCase(getRoomData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRoomData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isHost = action.payload.host;
      });
  },
});

export const {
  resetRoomState,
  setRoomName,
  setRoomID,
  setLoading,
  stopLoading,
  setMode,
  setError,
} = roomSlice.actions;
export default roomSlice.reducer;
