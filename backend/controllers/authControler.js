const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const {
  RtcTokenBuilder,
  RtmTokenBuilder,
  RtcRole,
  RtmRole,
} = require("agora-access-token");
const { now } = require("mongoose");

// @desc Create RTC token
// @route POST /api/auth/rtctoken
// @access Private
const rtcToken = asyncHandler(async (req, res) => {
  console.log("*rtc token gen'd*".green);

  if (!req.body) {
    res.status(401);
    throw new Error("No body data included!");
  }
  const { roomID, isPublisher } = req.body;
  const appID = process.env.AGORA_APP_ID;
  const appCert = process.env.AGORA_APP_CERT;

  console.log({
    appID,
    appCert,
    roomID,
    isPublisher,
  });

  const tokenRole = isPublisher ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

  const uid = String(Math.floor(Math.random() * 100000 + 1));

  //1 HR
  const expirationTimeinSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeinSeconds;

  const rtcToken = RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCert,
    roomID,
    uid,
    tokenRole
  );

  res.status(201).json({
    uid: uid,
    rtcToken,
  });
});

module.exports = {
  rtcToken,
};
