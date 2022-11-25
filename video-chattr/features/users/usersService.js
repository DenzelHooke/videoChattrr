import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_BACKEND_URL + "/users"
    : process.env.NEXT_PUBLIC_DEVELOPMENT_BACKEND_URL + "/users";

// console.log(process.env.NODE_ENV);
const getUsers = async (payload) => {
  const { userData, config } = payload;
  if (userData.length < 1) {
    return {
      users: [],
    };
  }

  // console.log(userData, config);

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
  // console.log("RES: ", res);
  if (res.data) {
    return res.data;
  }
};

const getIncomingFriendRequests = async (data) => {
  const { user } = data;

  const config = {
    headers: {
      authorization: `Bearer ${user.token}`,
    },
  };

  const res = await axios.get(`${API_URL}/requests?userID=${user._id}`, config);
  // console.log("RES: ", res);
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
  const { user, roomData } = data;
  const { roomID } = roomData;
  // console.log("DATA: ", roomID);

  const config = {
    headers: {
      authorization: `Bearer ${user.token}`,
    },
  };

  const res = await axios.delete(
    `${API_URL}/room?userID=${user._id}&roomID=${roomID}`,
    config
  );
  // console.log("RES: ", res);
  if (res.data) {
    return res.data;
  }
};

/**
 * Calls endpoint with DELETE request to remove value from client's friendRequest database field.
 * @param {object} data Object containing user & recepient userID property.
 * @returns {object} Object response data.
 */
const deleteFriendRequest = async (data) => {
  const { user, to } = data;

  const config = {
    headers: {
      authorization: `Bearer ${user.token}`,
    },
  };

  const res = await axios.delete(
    `${API_URL}/requests?clientID=${user._id}&requestSenderID=${to}&type=friendRequest`,
    config
  );
  // console.log("RES: ", res);
  if (res.data) {
    return res.data;
  }
};

/**
 * Calls endpoint with PUT request to accept friend request.
 * @param {object} data Object containing user & recepient userID property.
 * @returns {object} Object response data.
 */
const createFriend = async (data) => {
  const { user, to } = data;

  const config = {
    headers: {
      authorization: `Bearer ${user.token}`,
    },
  };

  const payload = {
    clientID: user._id,
    requestSenderID: to,
  };

  const res = await axios.post(`${API_URL}/friends`, payload, config);
  // console.log("RES: ", res);
  if (res.data) {
    return res.data;
  }
};

/**
 * Calls endpoint with PUT request to accept friend request.
 * @param {object} data Object containing user & recepient userID property.
 * @returns {object} Object response data.
 */
const getFriends = async (data) => {
  const { user } = data;

  const config = {
    headers: {
      authorization: `Bearer ${user.token}`,
    },
  };

  const res = await axios.get(`${API_URL}/friends?userID=${user._id}`, config);
  // console.log("RES: ", res);
  if (res.data) {
    return res.data;
  }
};

/**
 * Calls endpoint with PUT request to accept friend request.
 * @param {object} data Object containing user & recepient userID property.
 * @returns {object} Object response data.
 */
const deleteFriend = async (data) => {
  const { user, friendID } = data;

  const config = {
    headers: {
      authorization: `Bearer ${user.token}`,
    },
  };

  const res = await axios.delete(
    `${API_URL}/friends?userID=${user._id}&friendID=${friendID}`,
    config
  );
  // console.log("RES: ", res);
  if (res.data) {
    return res.data;
  }
};

const usersService = {
  getUsers,
  getSavedRooms,
  unsaveRoom,
  getIncomingFriendRequests,
  deleteFriendRequest,
  createFriend,
  getFriends,
  deleteFriend,
};

export default usersService;
