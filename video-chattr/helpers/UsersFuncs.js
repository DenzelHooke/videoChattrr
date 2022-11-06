import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? ""
    : "http://localhost:8080/api/users";

const sendFriendRequest = async (payload) => {
  const { data, config } = payload;

  const res = await axios.post(`${API_URL}/friendRequests/`, data, config);

  return res;
};

export { sendFriendRequest };