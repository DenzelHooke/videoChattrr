const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

// @desc Create RTC token
// @route POST /api/auth/create
// @access Private
const createRTCToken = asyncHandler(async (req, res) => {});
