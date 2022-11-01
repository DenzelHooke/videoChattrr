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

/**
 * Calls endpoint to retrive the client's saved rooms.
 * @param {object} data Object containing user property.
 * @returns {object} Object response data.
 */

const getSavedRooms = async (data) => {
  const { user } = data;

  const config = {
    headers: {
      authorization: `Bearer ${user.token}`,
    },
  };

  const res = await axios.get(`${API_URL}/room?userID=${user._id}`, config);
  console.log("RES: ", res);
  if (res.data) {
    return res.data;
  }
};

/**
 * Calls endpoint with DELETE request to remove value from client's saveRoom database field.
 * @param {object} data Object containing user & roomID property.
 * @returns {object} Object response data.
 */
const unsaveRoom = async (data) => {
  const { user, roomID } = data;

  const config = {
    headers: {
      authorization: `Bearer ${user.token}`,
    },
  };

  const res = await axios.delete(
    `${API_URL}/room?userID=${user._id}&roomID=${roomID}`,
    config
  );
  console.log("RES: ", res);
  if (res.data) {
    return res.data;
  }
};

const usersService = {
  getUsers,
  getSavedRooms,
  unsaveRoom,
};

export default usersService;
