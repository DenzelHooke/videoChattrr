const express = require("express");
const router = express.Router();

const { greetHelloWorld } = require("../controllers/testsControllers");

// /api/tests/greet
router.route("/greet/").get(greetHelloWorld);

module.exports = router;
