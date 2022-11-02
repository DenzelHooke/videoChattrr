const User = require("../models/userModel");
const Room = require("../models/roomModel");
const asyncHandler = require("express-async-handler");
const { uuid } = require("uuidv4");
const {
  getRoomFromDB,
  isRoomActive,
  isRoomOverCapacity,
  getUserFromRoomInMemory,
} = require("../helpers/room");
const { json } = require("express");
const { runningRooms } = require("../server");
// @desc Check is room exists already.
// @route POST /api/room/verify
// @access Private
const roomExists = asyncHandler(async (req, res) => {
  const { roomName } = req.body.roomName;

  // Uses regex to grab rooms regardless of their case sensitivity.
  const existingRoom = await Room.findOne({
    roomName: {
      $regex: `${roomName}`,
      $options: "i",
    },
  });
  const roomStatus = {
    roomName: roomName,
    host: null,
    exists: false,
  };

  console.log("exists: ", existingRoom);

  if (!req.body) {
    res.status(401);
    throw new Error("No body data in request!");
  }

  if (!existingRoom) {
    res.status(200).json(roomStatus);
    return;
  }

  if (existingRoom) {
    res.status(200).json({
      ...roomStatus,
      roomName: existingRoom.roomName,
      host: existingRoom.host,
    });
  }
});

const createRoom = asyncHandler(async (req, res) => {
  const { roomName, host, options } = req.body;
  const { joinable } = options;
  const user = await User.findById(host);

  // console.log(`User: `, user);

  if (user) {
    const newRoom = {
      roomName,
      host,
      joinable,
      roomID: genRoomID(),
    };
    await Room.create(newRoom);

    res.status(201).json(newRoom);
  } else {
    throw new Error(
      "The userID who sent this request can't be found on the server."
    );
  }
});

// @desc Check if room exists already.
// @route GET /api/room/:roomID
// @access Private
const getRoomData = asyncHandler(async (req, res) => {
  // console.log(`GET room hit.`, req);
  const roomID = req.query.roomID;
  // console.log("ROOMID", roomID);
  const room = await getRoomFromDB(roomID);

  if (room) {
    res.status(200).json({
      room: room,
      exists: true,
    });
  } else {
    res.status(200).json({
      room: false,
      exists: false,
    });
  }
});

const genRoomID = () => {
  return uuid();
};

// @desc Check if room exists already.
// @route GET /api/room/:roomID
// @access Private
const getRunningRooms = asyncHandler(async (req, res) => {
  const roomID = req.query.roomID;

  // console.log(module.exports);
  console.log(runningRooms);
  const room = isRoomActive(roomID);
  if (!room) {
    res.status(404).json({
      message: "Room not running.",
    });
    return;
  }
  console.log(room);
  const overcapacity = isRoomOverCapacity(room);

  if (overcapacity) {
    res.status(200).json({
      overcapacity: true,
    });
  } else {
    res.status(200).json({
      overcapacity: false,
    });
  }
});

const getUserRunning = asyncHandler(async (req, res) => {
  // console.log("REQ: ", req.query);
  const { roomID, agoraUID } = req.query;
  const user = await getUserFromRoomInMemory(agoraUID, roomID);

  if (!user) {
    console.error("[getUserRunning] : No user found!");
    res.status(404);
    return;
  }

  console.error("[getUserRunning] : User found!");
  res.status(200).json({
    exists: true,
    user: {
      username: user.username,
      agoraUID: agoraUID,
    },
  });
});

const saveRoom = asyncHandler(async (req, res) => {
  // console.log("SAVE ROOM HIT");
  let updated;

  if (!req.body) {
    throw new Error("No body data in request");
  }

  const { userID, roomID, bool } = req.body;
  // console.log(userID, roomID, bool);
  try {
    //Find user
    const user = await User.findById(userID);
    // Find room with roomID
    const room = await Room.findOne({ roomID });
    // console.log("ROOM: ", room);
    if (!user) {
      // Throw err if user can't be found
      res.status(400);
      throw new Error("User not found");
    }
    if (bool) {
      // User wants to save room

      //Check if room is already saved by client

      //Linear search through array for match
      for (i in user.savedRooms) {
        if (user.savedRooms[i].roomID.toLowerCase() === roomID.toLowerCase()) {
          console.log("duplicate found");
          res.status(400);
          throw new Error("Room has already been saved");
        }
        i++;
      }

      // Push object to savedRooms array in database.
      const updated = await User.updateOne(
        { _id: userID },
        {
          $push: { savedRooms: { roomID, roomName: room.roomName } },
        }
      );
      // console.log(updated);

      // Send updated array
      res.status(201).json({ updated });
      return;
    }

    //* Send null res for now
    res.status(200).json({ message: null });
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

module.exports = {
  roomExists,
  createRoom,
  getRoomData,
  getRunningRooms,
  getUserRunning,
  saveRoom,
};
