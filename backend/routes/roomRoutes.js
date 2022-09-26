const express = require("express");
const router = express.Router();

const { verify } = require("jsonwebtoken");
const {
  roomExists,
  createRoom,
  getRoomData,
} = require("../controllers/roomController");
const { protect } = require("../middleware/authMiddleware");

// /api/room/

router.route("/verify").post(protect, roomExists);
router.route("/").post(protect, createRoom);
router.route("/").get(protect, getRoomData);
module.exports = router;
