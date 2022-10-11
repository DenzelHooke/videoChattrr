import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const runningOnServer = typeof window === "undefined";

let user = null;
let rtcToken = null;

//* only True if nextjs is completed doing SSR'ing.
if (!runningOnServer) {
  user = JSON.parse(localStorage.getItem("user"));
  rtcToken = localStorage.getItem("rtcToken");
}

//*─── App State ──────────────────────────────────────────────────────────────────

const initialState = {
  user: user ? user : null,
  isError: null,
  isSuccess: null,
  isLoading: null,
  rtcToken: null,
  message: "",
  push: "",
  uid: null,
};

//* ─── Reducers ───────────────────────────────────────────────────────────────────

export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error) {
      const message =
        (error.message && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      const message =
        (error.message && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const genRTC = createAsyncThunk(
  "auth/genRTC",
  async (userData, thunkAPI) => {
    try {
      const res = await authService.genRTC(userData);
      return JSON.stringify(res.data);
    } catch (error) {
      const message =
        (error.message && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", (userData) => {
  return authService.logout();
});

//* ─── Slice Reducers And Extra Reducers ──────────────────────────────────────────

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    removeToken: (state) => {
      state.rtcToken = null;
    },
    resetPush: (state) => {
      state.push = "";
    },
    setPush: (state, action) => {
      state.push = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.user = null;
        state.message = action.payload;
      })

      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.user = null;
        state.message = action.payload;
        console.log(action);
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })

      .addCase(genRTC.fulfilled, (state, action) => {
        // console.log("action:  ", action);
        const payload = JSON.parse(action.payload);
        state.rtcToken = payload.rtcToken;
        state.uid = payload.uid;
        state.push = "room";
      })

      .addCase(genRTC.rejected, (state, action) => {
        state.message = action.payload;
        state.isError = true;
      });
  },
});

export const { reset, removeToken, resetPush, setPush } = authSlice.actions;
export default authSlice.reducer;
