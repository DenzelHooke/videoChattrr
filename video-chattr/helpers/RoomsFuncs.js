import axios from "axios";
import { genRTC, removeToken, setPush } from "../features/auth/authSlice";
import {
  setRoomName,
  setRoomID,
  setMode,
  resetRoomState,
} from "../features/room/roomSlice";

import { setError, setSuccess } from "../features/utils/utilsSlice";
const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_BACKEND_URL + "/room"
    : process.env.NEXT_PUBLIC_DEVELOPMENT_BACKEND_URL + "/room";

const roomExists = async (roomName, authToken) => {
  const config = {
    headers: {
      authorization: `Bearer ${authToken}`,
    },
  };

  console.log("token: ", authToken);

  console.log("REQ SENT");
  const res = await axios.post(
    API_URL + "/room/verify/",
    {
      roomName,
    },
    config
  );

  console.log("REQ RECIEVED");
  if (res.body) {
    if (res.body.roomStatus.exists) {
      return true;
    } else {
      return false;
    }
  }

  return false;
};

const createRoomCookie = (mode, rtcToken) => {
  const bundle = {
    mode,
    rtcToken,
  };
  document.cookie = `roomData=${JSON.stringify(bundle)}; expires=${new Date(
    9999,
    0,
    1
  ).toUTCString()}`;
};

const removeRoomCookie = () => {
  console.log("Removing room data cookie.");
  const cookie =
    (document.cookie = `roomData=; expires=${new Date().toUTCString()}`);
  console.log(cookie);
  return true;
};

const getRunningRoom = async (roomID, authToken) => {
  const config = {
    headers: {
      authorization: `Bearer ${authToken}`,
    },
  };

  try {
    const res = await axios.get(`${API_URL}/running?roomID=${roomID}`, config);

    if (res.data) {
      return res.data;
    }
  } catch (error) {
    console.error(error);
    return error;
  }
};

const getUserFromRunningRoom = async (roomID, uid) => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);
  const authToken = user.token;
  const config = {
    headers: {
      authorization: `Bearer ${authToken}`,
    },
  };
  const res = await axios.get(
    `${API_URL}/running/user?roomID=${roomID}&agoraUID=${uid}`,
    config
  );

  return res;
};

/**
 * Pre-sets and double checks data required before joining room. Pushes client to room once checks are all validated.
 * @param {Function} roomService module.exports object
 * @param {object} userInput User inputted data
 * @param {Class} userInput User inputted data
 */
const joinUserToRoom = async ({ roomService, userInput, dispatch, user }) => {
  dispatch(setMode("join"));
  console.log(`%c Requesting to join room ${userInput}`, "color: #4ce353");

  const data = await roomService.getRoomData(userInput);
  console.log(data);

  if (!data.exists) {
    dispatch(setError({ message: "This room could not be found." }));
    return;
  }

  //Checks if running room is over room capacity
  // const { overcapacity } = await getRunningRoom(data.room.roomID, user.token);

  // if (overcapacity) {
  //   dispatch(setError({ message: "This room is full." }));
  //   return;
  // }

  // Otherwise, notify client room is connecting.
  dispatch(setSuccess({ message: "Connecting to room" }));

  // Generate RTC then set a few perdinent states

  //The page will automatically push client to room page once setPush has been set to "room"
  dispatch(genRTC({ roomID: data.room.roomID }))
    .unwrap()
    .then(() => {
      console.log("ROOM NAME ", data.room.roomName);
      dispatch(setRoomName(data.room.roomName));
      dispatch(setRoomID(data.room.roomID));
      dispatch(setPush("room"));
    })
    .catch((error) => {
      dispatch(removeToken());
      dispatch(resetRoomState());
      dispatch(setError({ message: `${error}`, push: "/dashboard" }));
    });
};

const hideRemoteCamera = (data) => {
  const { id, state } = data;
};

export {
  roomExists,
  createRoomCookie,
  removeRoomCookie,
  getRunningRoom,
  getUserFromRunningRoom,
  joinUserToRoom,
  hideRemoteCamera,
};
