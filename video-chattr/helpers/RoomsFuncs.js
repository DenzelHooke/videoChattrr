import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8080/api/room";

const roomExists = async (roomName, authToken) => {
  console.log("token: ", authToken);
  const config = {
    headers: {
      authorization: `Bearer ${authToken}`,
    },
  };
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
    2023,
    0,
    1
  ).toUTCString()}`;
};

const getRunningRoom = async (roomID, authToken) => {
  const config = {
    headers: {
      authorization: `Bearer ${authToken}`,
    },
  };

  const res = await axios.get(`${API_URL}/running/?roomID=${roomID}`, config);

  if (res.data) {
    return res.data;
  }
};
export { roomExists, createRoomCookie, getRunningRoom };
