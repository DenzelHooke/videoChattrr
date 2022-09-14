const mongoose = require("mongoose");

const roomModel = mongoose.Schema({
  roomName: {
    type: String,
    required: [true, "Please enter a room name."],
  },
  host: {
    type: String,
    required: [true, "Please enter a room name."],
  },
});

module.exports = mongoose.model("Room", roomModel);
