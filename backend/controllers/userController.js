const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const { trusted } = require("mongoose");

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

//Gen JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  retrieveUser,
  loginUser,
};
