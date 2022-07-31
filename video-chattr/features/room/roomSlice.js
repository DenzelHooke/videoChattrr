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
  isHost: false,
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
      const res = await roomService.createRoom(userData);
      return JSON.stringify(res.data);
    } catch (error) {
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
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    setRoom: (state, action) => {
      state.roomName = action.payload;
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
      .addCase(genRTC.fulfilled, (state) => {
        state.isLoading = false;
      });
  },
});

export const { reset, setRoom } = roomSlice.actions;
export default roomSlice.reducer;
