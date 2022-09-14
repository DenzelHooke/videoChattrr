const User = require("../models/userModel");
const Room = require("../models/roomModel");
const asyncHandler = require("express-async-handler");

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
  const { roomName, host } = req.body;

  if (!req.body) {
    res.json(201);
    throw new Error("No body data provided.");
  }

  const newRoom = await Room.create({
    roomName: roomName,
    host,
  });
});

module.exports = {
  roomExists,
};
