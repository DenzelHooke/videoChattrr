const express = require("express");
const router = express.Router();

const { verify } = require("jsonwebtoken");
const { roomExists, createRoom } = require("../controllers/roomController");
const { protect } = require("../middleware/authMiddleware");

// /api/room/

router.route("/verify").post(protect, roomExists);
router.route("/").post(protect, createRoom);

module.exports = router;
