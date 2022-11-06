const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

// /api/users

//* Root
router.route("/").post(registerUser);
router.route("/").get(protect, findUsers);

//* Login
router.route("/login").post(loginUser);

//* Room
router.route("/room").get(protect, getSavedRooms);
router.route("/room").delete(protect, unsaveRoom);

//* Friends
router.route("/friends").post(protect, createFriend);
router.route("/friends").get(protect, getFriends);
router.route("/friends").delete(protect, deleteFriend);

//* FriendRequests
router.route("/friendRequests").post(protect, sendFriendRequest);

//* Requests (Getting sent and incoming user requsets)
router.route("/requests").get(protect, getUserRequests);
router.route("/requests").delete(protect, deleteUserRequests);
// router.route("/me").get(retrieveUser);

module.exports = router;
