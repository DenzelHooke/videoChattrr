const mongoose = require("mongoose");

const roomModel = mongoose.Schema({
  roomName: {
    type: String,
    required: [true, "Please enter a room name."],
  },
  host: {
    type: String,
    required: [true, "Please enter a host name."],
  },
  joinable: {
    type: String,
    required: [true, "Please enter a joinability status."],
  },
});

module.exports = mongoose.model("Room", roomModel);
