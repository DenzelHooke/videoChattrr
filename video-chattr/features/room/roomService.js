const API_URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8080/api/room";
import axios from "axios";
import { useSelector } from "react-redux";

const createRoom = async (userData) => {
  console.log("create room func called");
  //Calls backend with rtcToken as param to create
  // const user = useSelector((state) => state.auth);

  const roomName = userData.roomID;
  const { user } = userData;

  const config = {
    headers: {
      authorization: `Bearer ${user.token}`,
    },
  };
  const payload = {
    roomName,
    host: user._id,
    options: {
      joinable: true,
    },
  };

  console.log("%c Sending data to server...", "color: #4ce353");
  const res = await axios.post(API_URL, payload, config);

  console.log(res.data);

  if (res.data) {
    return res.data;
  }
};

const getRoomData = async (roomID) => {
  let user = localStorage.getItem("user");
  user = JSON.parse(user);
  const { token } = user;

  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(`${API_URL}?roomID=${roomID}`, config);

  if (res.data) {
    return res.data;
  }
};

const roomService = {
  createRoom,
  getRoomData,
};

export default roomService;
