const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const { trusted } = require("mongoose");
const { json } = require("express");

// @desc Register User
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error("Must add username or password!");
  }

  const exists = await User.findOne({ username });

  if (exists) {
    // console.log(exists);
    res.status(401);
    throw new Error("A user with that username already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    username,
    password: hashedPass,
  });

  if (newUser) {
    res.status(201).json({
      _id: newUser.id,
      username: username,
      token: generateToken(newUser.id),
    });
  }
});

// @desc Login User
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error("Must add username or password!");
  }

  //Regex that tells mongodb to look for usernames that match the
  // username in the request regardless of case sensitivity.
  const user = await User.findOne({
    username: { $regex: `${username}`, $options: "i" },
  });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user.id,
      username: user.username,
      token: generateToken(user.id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid username or password.");
  }
});

// @desc Retrieve User
// @route GET /api/users/:id
// @access Private
const retrieveUser = (req, res) => {
  res.json({ user: { name: "john" } });
};

const findUsers = async (req, res) => {
  console.log(req.query);
  const { username } = req.query;

  const users = await User.find(
    {
      username: {
        $regex: `${username}`,
        $options: "i",
      },
    },
    { username: 1, _id: 1 }
  );

  console.log(users);

  if (users) {
    res.status(200).json({
      users,
    });
  } else {
    res.status(200).json({
      users: null,
    });
  }
};

const sendFriendRequest = async (req, res) => {
  const { to, from } = req.body;
  let duplicateFound;

  // console.log(req.body);

  const user = await User.findById(to);

  user.friendRequests.forEach((item) => {
    if (item._id === from) {
      duplicateFound = true;
    }
  });

  if (duplicateFound) {
    console.log("Duplicate found!!!!");
    res.status(200).json({
      message: "Friend Request already sent.",
      exists: true,
    });
    return;
  } else {
    const update = await User.updateOne(
      { _id: to },
      {
        $push: {
          friendRequests: {
            _id: from,
            sentAt: new Date().toUTCString(),
          },
        },
      }
    );

    console.log(update);

    if (update) {
      res.status(201).json({
        message: "Friend Request sent.",
        exists: false,
        to,
      });
    }
  }

  console.log(user);
};

//Gen JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const getSavedRooms = asyncHandler(async (req, res) => {
  console.log("REQ: ", req);
  const { userID } = req.query;

  if (!userID) {
    res.status(401).json({
      message: "Request to this endpoint must contain a userID query",
    });
  }

  const user = await User.findById(userID);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    savedRooms: user.savedRooms,
  });
});

const unsaveRoom = asyncHandler(async (req, res) => {
  const { userID, roomID } = req.query;
  console.log("DELETE: ", req.query);

  const user = await User.findById(userID);

  if (!user) {
    throw new Error("User not found");
  }

  const newSavedRooms = user.savedRooms.filter((item) => {
    return item.roomID.toLowerCase() !== roomID.toLowerCase();
  });

  console.log(newSavedRooms);
  const updated = await User.updateOne(
    { _id: userID },
    {
      $set: { savedRooms: newSavedRooms },
    }
  );
  res.status(200).json({ data: updated });
});

module.exports = {
  registerUser,
  retrieveUser,
  loginUser,
  findUsers,
  sendFriendRequest,
  getSavedRooms,
  unsaveRoom,
};
