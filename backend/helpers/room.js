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
  // console.log(`Removing user: ${userID} from room.`);

  // console.log(room.users);

  // console.log(`Users before deletion`, rooms);
  let found = false;
  for (let i = 0; i < rooms.length; i++) {
    if (found) {
      break;
    }
    const room = rooms[i];
    if (room.roomID === roomID) {
      for (let x = 0; x < room.users.length; i++) {
        // console.log("-- FOUND ROOM --\n".bgRed, rooms[i]);
        const users = rooms[i].users;
        if (users[x].userID === userID) {
          const user = users[x];
          const userIndex = users.indexOf(user);
          users.splice(userIndex, 1);
          found = true;
          break;
        }
      }
    }
  }

  // console.log(`Users after deletion`, rooms);
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
