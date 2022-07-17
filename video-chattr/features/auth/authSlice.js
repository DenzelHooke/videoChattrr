import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const runningOnServer = typeof window === "undefined";

let user = null;
let rtcToken = null;

// True if nextjs is done SSR'ing.
if (!runningOnServer) {
  user = JSON.parse(localStorage.getItem("user"));
  rtcToken = localStorage.getItem("rtcToken");
}

const initialState = {
  user: user ? user : null,
  isError: null,
  isSuccess: null,
  isLoading: null,
  rtcToken: rtcToken ? rtcToken : null,
  message: "",
};

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
  "auth/getRTC",
  async (userData, thunkAPI) => {
    try {
      const res = await authService.getRTC(userData);
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
        const payload = JSON.parse(action.payload);
        console.log("action: ", payload);
        state.rtcToken = payload.rtcToken;
        state.uid = payload.uid;
      })

      .addCase(genRTC.rejected, (state, action) => {});
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
