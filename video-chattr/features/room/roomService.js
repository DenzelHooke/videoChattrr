import axios from "axios";
const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_BACKEND_URL + "/room"
    : process.env.NEXT_PUBLIC_DEVELOPMENT_BACKEND_URL + "/room";

// console.log(process.env);

const createRoom = async (userData) => {
  console.log("create room func called");
  //Calls backend with rtcToken as param to create
  // const user = useSelector((state) => state.auth);

  const roomName = userData.userInput;
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

const getRoomData = async (userInput) => {
  let user = localStorage.getItem("user");
  user = JSON.parse(user);
  const { token } = user;

  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(`${API_URL}?roomID=${userInput}`, config);

  if (res.data) {
    return res.data;
  }
};

const saveRoom = async (data) => {
  const { user } = data;

  const config = {
    headers: {
      authorization: `Bearer ${user.token}`,
    },
  };

  console.log("sending req");
  const res = await axios.post(`${API_URL}/save`, data, config);
  console.log("RES: ", res);
  if (res.data) {
    return res.data;
  }
};

const roomService = {
  createRoom,
  getRoomData,
  saveRoom,
};

export default roomService;
