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
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400);
      throw new Error("Must add username or password!");
    }

    const exists = await User.findOne({ username });

    if (exists) {
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
  } catch (error) {
    res.status(401);
    throw new Error(error.message);
  }
});

// @desc Login User
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    res.status(401);
    throw new Error(error.message);
  }
});

// @desc Retrieve User
// @route GET /api/users/:id
// @access Private
const retrieveUser = (req, res) => {
  res.json({ user: { name: "john" } });
};

const findUsers = async (req, res) => {
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

const sendFriendRequest = asyncHandler(async (req, res) => {
  const { to, from } = req.body;
  let duplicateFound;

  const user = await User.findById(to);
  const userFrom = await User.findById(from);

  // Check if sender is already friends with client
  const friendsAlready = user.friends.filter((item) => {
    return item._id.toString() === userFrom._id.toString();
  });

  if (friendsAlready.length > 0) {
    throw new Error("You are already friends with this user.");
  }

  user.friendRequests.forEach((item) => {
    if (item._id === from) {
      duplicateFound = true;
    }
  });

  if (duplicateFound) {
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
            username: userFrom.username,
            sentAt: new Date().toUTCString(),
          },
        },
      }
    );

    if (update) {
      res.status(201).json({
        message: "Friend Request sent.",
        exists: false,
        to,
      });
    }
  }
});

//Gen JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const getSavedRooms = asyncHandler(async (req, res) => {
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
  try {
    const { userID, roomID } = req.query;

    const user = await User.findById(userID);

    if (!user) {
      throw new Error("User not found");
    }

    const newSavedRooms = user.savedRooms.filter((item) => {
      return item.roomID.toLowerCase() !== roomID.toLowerCase();
    });

    const updated = await User.updateOne(
      { _id: userID },
      {
        $set: { savedRooms: newSavedRooms },
      }
    );
    res.status(201).json({ data: updated });
  } catch (error) {
    throw new Error(error.message);
  }
});

const getUserRequests = asyncHandler(async (req, res) => {
  const userID = req.query.userID;

  const user = await User.findById(userID);
  const fRequests = user.friendRequests;

  if (!user) {
    res.status(404);
    return;
  }
  res.status(200).json({
    friendRequests: fRequests,
  });
});

const deleteUserRequests = asyncHandler(async (req, res) => {
  try {
    const { requestSenderID, clientID, type } = req.query;
    const client = await User.findById(clientID);
    const sender = await User.findById(requestSenderID);

    if (type.toLowerCase() === "friendRequest".toLowerCase()) {
      // Remove the senders friend request from client
      const newFriendRequests = client.friendRequests.filter((item) => {
        return item._id.toLowerCase() !== requestSenderID.toLowerCase();
      });
      const updated = await User.updateOne(
        { _id: client._id },
        {
          $set: { friendRequests: newFriendRequests },
        }
      );

      res.status(201).json({ friendRequests: newFriendRequests });
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

const createFriend = asyncHandler(async (req, res) => {
  try {
    const { requestSenderID, clientID } = req.body;
    const client = await User.findById(clientID);
    const sender = await User.findById(requestSenderID);

    // Remove the senders friend request from client if exists
    const newFriendRequests = client.friendRequests.filter((item) => {
      return item._id.toLowerCase() !== requestSenderID.toLowerCase();
    });

    // Remove friend request
    const updatedReq = await User.updateOne(
      { _id: client._id },
      {
        $set: { friendRequests: newFriendRequests },
      }
    );

    //Set requestSenderID as a friend for client

    const updatedFriends = await User.updateOne(
      { _id: client._id },
      {
        $push: {
          friends: {
            _id: sender._id,
            username: sender.username,
          },
        },
      }
    );

    // Set user who accepted request as a friend for the user who sent request.
    await User.updateOne(
      { _id: requestSenderID },
      {
        $push: {
          friends: {
            _id: client._id,
            username: client.username,
          },
        },
      }
    );
    // Refetch user
    const updatedClient = await User.findById(clientID);

    res
      .status(201)
      .json({ friends: updatedClient.friends, friend: sender._id });
  } catch (error) {
    throw new Error(error.message);
  }
});

const getFriends = asyncHandler(async (req, res) => {
  try {
    const { userID } = req.query;

    const user = await User.findById(userID);

    const allFriends = await Promise.all(
      user.friends.map(async (item) => {
        const friend = await User.findById(item._id);
        return {
          _id: friend._id,
          username: friend.username,
          currentRoom: friend.currentRoom,
        };
      })
    );

    res.status(200).json({ friends: allFriends });
  } catch (error) {
    throw new Error(error.message);
  }
});

const deleteFriend = asyncHandler(async (req, res) => {
  try {
    const { userID, friendID } = req.query;

    const user = await User.findById(userID);
    const friend = await User.findById(friendID);

    //Client's new friends
    const newClientFriends = user.friends.filter((item) => {
      return item._id.toString() !== friendID;
    });

    //FriendID's new friends
    const newFriendFriends = friend.friends.filter((item) => {
      return item._id.toString() !== userID;
    });

    // Update friends on client model
    const updated_client = await User.updateOne(
      { _id: userID },
      {
        $set: { friends: newClientFriends },
      }
    );

    //Update friends on friend model
    const updated_friend = await User.updateOne(
      { _id: friendID },
      {
        $set: { friends: newFriendFriends },
      }
    );

    res.status(200).json({ friends: newClientFriends });
  } catch (error) {
    throw new Error(error.message);
  }
});

module.exports = {
  registerUser,
  retrieveUser,
  loginUser,
  findUsers,
  sendFriendRequest,
  getSavedRooms,
  unsaveRoom,
  getUserRequests,
  deleteUserRequests,
  createFriend,
  getFriends,
  deleteFriend,
};
