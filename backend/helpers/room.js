const Room = require("../models/roomModel");

const getRoomFromDB = async (roomID) => {
  const room = await Room.findOne({ roomID });

  if (!room) {
    return false;
  }

  return room;
};

const isRoomJoinable = async (roomID) => {
  const room = await getRoomFromDB(roomID);
  if (room) {
    return room.joinable;
  } else {
    return false;
  }
};

const isRoomActive = (roomID, rooms) => {
  if (verifyRoomExistsInDB(roomID)) {
    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      console.log(room, rooms);
      if (room.roomID.toLowerCase() === roomID.toLowerCase()) {
        return room;
      }
    }

    return false;
  }
};

const isHost = async (roomID, userID) => {
  const room = getRoomFromDB(roomID);

  const hostID = room.host;

  if (userID.toLowerCase() !== hostID.toLowerCase()) {
    return false;
  }

  return true;
};

const verifyRoomExistsInDB = async (roomID) => {
  const roomExists = await getRoomFromDB(roomID);
  if (roomExists) {
    return true;
  } else {
    return false;
  }
};

const createUserInMemory = async (roomID, user) => {
  return {
    username: user.username,
    isHost: isHost(roomID),
  };
};

const createRoomInMemory = async (roomID, rooms) => {
  const room = {
    roomID,
    users: [],
  };

  rooms.push(room);
  console.log("Added room to room array");
  return true;
};

const addUserToRoomInMemory = async (roomID, user, rooms) => {
  const room = isRoomActive(roomID, rooms);

  room.users.push(user);
  console.log(`User ${user.username} added to room ${roomID.slice(0, 7)}`);
};

module.exports = {
  verifyRoomExistsInDB,
  isRoomActive,
  isRoomJoinable,
  createRoomInMemory,
  addUserToRoomInMemory,
  getRoomFromDB,
  isHost,
};
