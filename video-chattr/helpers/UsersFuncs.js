import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_BACKEND_URL + "/users"
    : process.env.NEXT_PUBLIC_DEVELOPMENT_BACKEND_URL + "/users";

const sendFriendRequest = async (payload) => {
  const { data, config } = payload;

  const res = await axios.post(`${API_URL}/friendRequests/`, data, config);

  return res;
};

export { sendFriendRequest };
