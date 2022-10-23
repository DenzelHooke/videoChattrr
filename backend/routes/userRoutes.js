const express = require("express");
const router = express.Router();
const {
  registerUser,
  retrieveUser,
  loginUser,
  findUsers,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

// /api/users
router.route("/").post(registerUser);
router.route("/login").post(loginUser);
router.route("/").get(protect, findUsers);
router.route("/me").get(retrieveUser);

module.exports = router;
