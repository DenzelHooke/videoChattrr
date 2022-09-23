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
const {
  verifyRoomExistsInDB,
  isRoomActive,
  isRoomJoinable,
  createRoomInMemory,
  addUserToRoomInMemory,
  getRoomFromDB,
} = require("./helpers/room");

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

const rooms = [
  {
    roomID: "123",
  },
  {
    roomID: "testRoom",
  },
];

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

  socket.on("joinRoom", async (data) => {
    const { username, roomID, userID } = data;

    //TODO Check db for a room with that roomID
    const roomExists = await verifyRoomExistsInDB(roomID);
    console.log(roomExists);

    // Room exists, proceed further.
    if (roomExists) {
      console.log("room exists!");

      // Check if room is running currently with users in it.
      // TODO Check if any room is in memory with same roomID
      const activeRoom = await isRoomActive(roomID, rooms);
      if (!activeRoom) {
        const user = {
          username,
          socket: socket,
          userID,
        };

        //Room isn't running currently but check if it's 'joinable'.
        // If it is then add client to socket channel and to the room in memory
        //TODO assign user to that room channel
        const room = await getRoomFromDB(roomID);
        if (room.joinable) {
          socket.join(roomID);
          createRoomInMemory(roomID, rooms);
          addUserToRoomInMemory(roomID, user, rooms);

          console.log(`Client connected to room ${activeRoom.roomID}`);
          return;
        }
      }
      if (activeRoom) {
        console.log(`Room found: ${activeRoom}`);
      } else {
        console.log("room not found!");
      }
    }

    // TODO create room with that room ID

    // TODO Auth client depending on whether they are the host or not of that room.
    console.log(data);
  });

  socket.on("init", async (data) => {});
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
