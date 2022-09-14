const express = require("express");
const path = require("path");
const dotenv = require("dotenv").config({ path: ".env.local" });
const colors = require("colors");
const socketio = require("socket.io");
const cors = require("cors");
const http = require("http");
const { connectDB } = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");
const jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 8080;
const dev = process.env.NODE_ENV !== "production";
const app = express();
// const handle = app.getRequestHandler();

const server = http.createServer(app);

connectDB();

const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const isValidJwt = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded) {
    return false;
  } else {
    return true;
  }
};

//Set up socket io

//* Verifies token of incoming socket connection.
io.use((socket, next) => {
  const unverifiedToken = socket.handshake.auth.token;

  if (isValidJwt(unverifiedToken)) {
    console.log(`USER: ${socket.id} is using valid data!`.bgBlue.white);
    next();
  } else {
    next(new Error("Socket authentication failed!"));
  }
});

io.on("connection", (socket) => {
  console.log("User connected".america);

  socket.on("init", async (data) => {
    const user = data.user;
    const userRoom = data.room;
  });
});

// Room join

//Room leave

// Room quantity

// real time chat

app.use("/api/users/", require("./routes/userRoutes"));
app.use("/api/auth/", require("./routes/authRoutes"));
app.use("/api/room/", require("./routes/roomRoutes"));

// server.get("*", (req, res) => {
//   return handle(req, res);
// });

app.use(errorHandler);
server.listen(PORT, (e) => {
  if (e) {
    throw Error(e);
  }
  console.log(`running on port ${PORT}`);
});
