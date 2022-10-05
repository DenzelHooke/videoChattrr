const Room = require("../models/roomModel");
const User = require("../models/userModel");

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
      // console.log(room, rooms);
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

const createRoomInMemory = (roomID, rooms) => {
  const room = {
    roomID: roomID,
    users: [],
  };

  rooms.push(room);
  // console.log("Rooms: ", rooms);
  // console.log("Added room to room array");
  return room;
};

const createUserInMemory = async (username, socket, userID) => {
  const user = await User.findOne({ userID });

  if (user) {
    return {
      username,
      socket: socket,
      userID,
    };
  } else {
    throw new Error("No user with that ID found!");
  }
};

const addUserToRoomInMemory = (username, socket, userID, room) => {
  // console.log(`Room to add to memory: `, room);
  const user = {
    username,
    socket,
    userID,
  };
  // console.log(room.users);
  room.users.push(user);
  // console.log(`User ${user.username} added to room ${room.roomID}`);
};

const removeUserFromRoomInMemory = (userID, roomID, rooms) => {
  for (let i in rooms) {
    const room = rooms[i];
    const userIndex = room.users.findIndex((user) => user.userID === userID);
    console.log("ROOM: ", room);
    console.log("USER INDEX: ", userIndex);

    if (userIndex != -1) {
      const usersInRoom = room.users;
      console.log("USER: ", usersInRoom[userIndex].username);
      usersInRoom.splice(userIndex, 1);
      console.log(room);

      return true;
    }
  }
};

module.exports = {
  verifyRoomExistsInDB,
  isRoomActive,
  isRoomJoinable,
  createRoomInMemory,
  removeUserFromRoomInMemory,
  createUserInMemory,
  addUserToRoomInMemory,
  getRoomFromDB,
  isHost,
};
