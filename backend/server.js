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
  createUserInMemory,
  removeUserFromRoomInMemory,
  createRoomInMemory,
  addUserToRoomInMemory,
  getRoomFromDB,
} = require("./helpers/room");
const { on } = require("events");

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
  // {
  //   roomID: "102efea0-5ed7-4929-b3bf-01cb0a9816e2",
  //   users: []
  // },
];

const isValidJwt = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    throw new Error(error);
  }
};

//Set up socket io

//* Verifies token of incoming socket connection.
io.use((socket, next) => {
  const unverifiedToken = socket.handshake.auth.token;
  console.log("User attempting to connect.".bgCyan.white);

  if (isValidJwt(unverifiedToken)) {
    console.log(`USER: ${socket.id} is using valid data!`.bgBlue.white);
    next();
  } else {
    next(new Error("Socket authentication failed!"));
  }
});

io.on("connection", (socket) => {
  const { username, userID } = JSON.parse(socket.handshake.auth.user);
  console.log("User connected".america);

  socket.on("disconnect", async (data) => {
    const roomID = socket.handshake.auth.roomID;
    removeUserFromRoomInMemory(userID, roomID, rooms);
    console.log(roomID);
    console.log(data);
  });

  socket.on("removeUser", async (data) => {
    const { roomID } = data;
    console.log(data);
    removeUserFromRoomInMemory(userID, roomID, rooms);
  });

  socket.on("createRoom", async (data) => {
    console.log("Create room in mem called", data);
    console.log(data);
    const { roomID } = data;

    const room = createRoomInMemory(roomID, rooms);
    // await createUserInMemory(username, socket, userID);

    addUserToRoomInMemory(username, socket, userID, room);
    console.log(rooms);
    socket.emit("roomJoined");
  });

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
      const user = await createUserInMemory(username, socket, userID);

      if (!activeRoom) {
        //Room isn't running currently but check if it's 'joinable'.
        // If it is then add client to socket channel and to the room in memory
        //TODO assign user to that room channel
        const room = await getRoomFromDB(roomID);
        if (room.joinable) {
          const newRoom = createRoomInMemory(roomID, rooms);
          addUserToRoomInMemory(user, newRoom);
          socket.join(roomID);

          console.log(`Client connected to room ${newRoom.roomID}`);
          console.log("ALL ROOMS: ", rooms);
          return;
        }
      } else if (activeRoom) {
        console.log(`Room found: ${activeRoom}`);
        console.log(rooms);
      } else {
        console.log("room not found!");
      }
    } else {
      return;
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
