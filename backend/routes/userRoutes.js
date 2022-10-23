const express = require("express");
const router = express.Router();
const {
  registerUser,
  retrieveUser,
  loginUser,
  findUsers,
  sendFriendRequest,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

// /api/users
router.route("/").post(registerUser);
router.route("/login").post(loginUser);
router.route("/").get(protect, findUsers);
router.route("/friends/").post(protect, sendFriendRequest);
// router.route("/me").get(retrieveUser);

module.exports = router;
