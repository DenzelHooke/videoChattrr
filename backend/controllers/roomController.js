const User = require("../models/userModel");
const Room = require("../models/roomModel");
const asyncHandler = require("express-async-handler");
const { uuid } = require("uuidv4");
const { getRoomFromDB } = require("../helpers/room");
const { json } = require("express");

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

const getRoomData = asyncHandler(async (req, res) => {
  // console.log(`GET room hit.`, req);
  const roomID = req.query.roomID;
  console.log("ROOMID", roomID);
  const room = await getRoomFromDB(roomID);

  if (room) {
    res.status(200).json({
      room: room,
      exists: false,
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

module.exports = {
  roomExists,
  createRoom,
  getRoomData,
};
