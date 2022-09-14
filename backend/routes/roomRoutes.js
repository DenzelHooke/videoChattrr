const express = require("express");
const router = express.Router();

const { verify } = require("jsonwebtoken");
const { roomExists } = require("../controllers/roomController");
const { protect } = require("../middleware/authMiddleware");

// /api/room/verify

router.route("/verify").post(protect, roomExists);

module.exports = router;
