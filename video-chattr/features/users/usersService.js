const API_URL =
  process.env.NODE_ENV === "production"
    ? ""
    : "http://localhost:8080/api/users";
import axios from "axios";

const getUsers = async (payload) => {
  const { userData, config } = payload;
  if (userData.length < 1) {
    return {
      users: [],
    };
  }

  console.log(userData, config);

  const res = await axios.get(`${API_URL}?username=${userData}`, config);

  if (res.data) {
    return res.data;
  }
};

const usersService = {
  getUsers,
};

export default usersService;
