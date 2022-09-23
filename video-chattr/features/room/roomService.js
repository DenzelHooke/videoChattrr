const API_URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8080/api/room";
import axios from "axios";
import { useSelector } from "react-redux";

const createRoom = async (userData) => {
  console.log("create room func called");
  //Calls backend with rtcToken as param to create
  // const user = useSelector((state) => state.auth);
  console.log("HIT");
  const { roomName } = userData;
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

  console.log(userData);
  console.log("%c Sending data to server...", "color: #4ce353");
  const res = await axios.post(API_URL, payload, config);

  if (res.data) {
    return res;
  }
};

const roomService = {
  createRoom,
};

export default roomService;
