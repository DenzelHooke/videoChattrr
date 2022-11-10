const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add a username"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    friends: {
      type: Array,
      required: [false],
    },
    friendRequests: {
      type: Array,
      required: [false],
    },
    savedRooms: {
      type: Array,
      required: [false],
    },
    currentRoom: {
      type: String,
      required: [false],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
