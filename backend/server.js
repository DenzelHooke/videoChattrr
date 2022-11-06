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
const log = require("loglevel");
const {
  verifyRoomExistsInDB,
  isRoomActive,
  isRoomJoinable,
  createUserInMemory,
  removeUserFromRoomInMemory,
  createRoomInMemory,
  addUserToRoomInMemory,
  getRoomFromDB,
  isRoomOverCapacity,
  rooms,
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
  const agoraUID = socket.handshake.auth.agoraUID;
  console.log("User connected".america);

  socket.on("disconnect", async (data) => {
    const { roomID } = socket.handshake.auth.room;
    removeUserFromRoomInMemory(userID, roomID, rooms);

    io.to(roomID).emit("userLeft", {
      username: username,
      userID: userID,
      agoraUID: agoraUID,
    });
    // console.log(roomID);
    // console.log(data);
  });

  socket.on("createRoom", async (data) => {
    console.log("Create room in mem called", data);
    const { roomID } = data;
    socket.join(roomID);
    console.log(rooms);
    socket.emit("roomJoined");
  });

  socket.on("joinRoom", async (data) => {
    // const { username, userID } = data;
    console.log("JOIN room HIT", data);
    const { roomID } = socket.handshake.auth.room;

    const room = await getRoomFromDB(roomID);

    // Room exists, proceed further.
    if (room) {
      let activeRoom;
      let user;

      try {
        console.info("- Room exists! -");
        console.trace(room);

        // Check if room is running currently with users in it.
        // TODO Check if any room is in memory with same roomID
        activeRoom = isRoomActive(roomID);

        // if (isRoomOverCapacity) {
        //   socket.emit("errorTriggered", {
        //     message: "The room you are trying to join is full.",
        //   });
        //   console.log("ROOM FULL".bgRed);
        //   return;
        // }
        console.info(" - Checking if room is active - ");
        console.info(activeRoom);
        // Create user in memory
        user = await createUserInMemory(username, socket, userID, agoraUID);
        console.info(" - Generating user in memory - ");
        console.info(rooms);
      } catch (error) {
        throw new Error(error);
      }

      if (!activeRoom) {
        console.info("- Room not running - ");
        //Room isn't running currently but check if it's 'joinable'.
        // If it is then add client to socket channel and to the room in memory
        //TODO assign user to that room channel
        if (room.joinable) {
          console.log(" - Creating room - ");
          const room = createRoomInMemory(roomID, rooms);
          addUserToRoomInMemory({ user, room });
          console.log(" - User joined to room - ");
          socket.join(roomID);
          socket.emit("roomJoined");

          console.log("ALL ROOMS: ", rooms);
          return;
        }
      } else if (activeRoom) {
        //TODO Join user to active room
        console.log("____Room already running____");
        console.log(activeRoom);
        console.log(" - Joining user to active room -");

        // Push user to active room
        activeRoom.users.push(user);

        // Join socket to channel
        socket.join(roomID);

        //Emit event
        socket.emit("roomJoined");
        console.log(rooms);

        return;
      }
    }

    // TODO Auth client depending on whether they are the host or not of that room.
    console.log(data);
  });

  socket.on("init", async (data) => {});
});

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
