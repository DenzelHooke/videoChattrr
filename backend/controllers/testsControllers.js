const asyncHander = require("express-async-handler");

const greetHelloWorld = asyncHander((req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

module.exports = {
  greetHelloWorld,
};
