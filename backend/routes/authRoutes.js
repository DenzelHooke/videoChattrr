const express = require("express");
const router = express.Router();
const { rtcToken } = require("../controllers/authControler");
const { protect } = require("../middleware/authMiddleware");
// /api/auth/
router.route("/rtctoken").post(protect, rtcToken);

module.exports = router;
