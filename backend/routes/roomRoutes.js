const express = require("express");
const router = express.Router();

const { verify } = require("jsonwebtoken");
const {
  roomExists,
  createRoom,
  getRoomData,
  getRunningRooms,
  getUserRunning,
} = require("../controllers/roomController");
const { protect } = require("../middleware/authMiddleware");

// /api/room/

router.route("/verify").post(protect, roomExists);
router.route("/").post(protect, createRoom);
router.route("/").get(protect, getRoomData);

router.route("/running").get(protect, getRunningRooms);
router.route("/running/user").get(protect, getUserRunning);

module.exports = router;
