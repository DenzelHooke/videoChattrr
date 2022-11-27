const Room = require("../models/roomModel");
const User = require("../models/userModel");
const rooms = [
  {
    roomID: "21b1ea4f-9c5b-400b-9ac4-17f645682cfc",
    users: [],
  },
  {
    roomID: "testRoom",
    users: [],
  },
  // {
  //   roomID: "102efea0-5ed7-4929-b3bf-01cb0a9816e2",
  //   users: []
  // },
];

//! CHANGE TO ENV VAR
const roomCapacityLimit = process.env.ROOM_CAPACITY_LIMIT;

const getRoomFromDB = async (roomID) => {
  const room = await Room.findOne({ roomID });
  console.log("room from db: , ", room);
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

const isRoomActive = async (roomID) => {
  console.log(rooms);
  if (await verifyRoomExistsInDB(roomID)) {
    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      // console.log(room, rooms);
      if (room.roomID.toLowerCase() === roomID.toLowerCase()) {
        return room;
      }
    }
  }
  return false;
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

const createUserInMemory = async (username, socket, userID, agoraUID) => {
  const user = await User.findOne({ userID });

  if (user) {
    return {
      username,
      socket: socket,
      userID,
      agoraUID,
    };
  } else {
    throw new Error("No user with that ID found!");
  }
};

const addUserToRoomInMemory = ({ user, room }) => {
  // console.log(`Room to add to memory: `, room);

  // console.log(room.users);
  room.users.push(user);
  return room;
  // console.log(`User ${user.username} added to room ${room.roomID}`);
};

const isRoomOverCapacity = (room) => {
  if (!room) {
    throw new Error("Please pass a room as the parameter.");
  }

  if (room.users.length >= roomCapacityLimit) {
    console.log("Room is full".bgRed);
    return true;
  }

  return false;
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

const getUserFromRoomInMemory = async (agoraUID, roomID) => {
  try {
    const room = await isRoomActive(roomID);
    let user;
    if (room) {
      console.log("room found");
      // console.log("room: ", room);
      user = room.users.find((item) => item.agoraUID === agoraUID);
      // console.log("user ", user);
    }

    if (!user) {
      return false;
    }
    return user;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const setJoinedRoom = async ({ removeRoom, roomID, userID }) => {
  const user = await User.findById(userID);

  if (!user) {
    throw new Error("No user was included.");
  }

  if (removeRoom) {
    // Update user model with false roomID
    return await User.updateOne(
      { _id: userID },
      { $set: { currentRoom: null } }
    );
  }

  // Update user model with roomID
  const updated = await User.updateOne(
    { _id: userID },
    { $set: { currentRoom: roomID } }
  );

  return updated;
};

module.exports = {
  verifyRoomExistsInDB,
  isRoomActive,
  isRoomJoinable,
  createRoomInMemory,
  removeUserFromRoomInMemory,
  createUserInMemory,
  isRoomOverCapacity,
  addUserToRoomInMemory,
  getRoomFromDB,
  isHost,
  getUserFromRoomInMemory,
  rooms,
  setJoinedRoom,
};
