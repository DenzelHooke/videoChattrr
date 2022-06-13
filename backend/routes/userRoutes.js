const express = require("express");
const router = express.Router();
const {
  registerUser,
  retrieveUser,
  loginUser,
} = require("../controllers/userController");

// /api/users
router.route("/").post(registerUser);
router.route("/login").post(loginUser);

router.route("/me").get(retrieveUser);

module.exports = router;
