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
  isRoomActive,
  createUserInMemory,
  removeUserFromRoomInMemory,
  createRoomInMemory,
  addUserToRoomInMemory,
  getRoomFromDB,
  setJoinedRoom,
  rooms,
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

    // Set models current room to false
    await setJoinedRoom({ removeRoom: true, userID });

    // Rempove user from memory
    removeUserFromRoomInMemory(userID, roomID, rooms);

    // Emit userLeft signal to other clients that were in the same room as user.
    socket.to(roomID).emit("userLeft", {
      username: username,
      userID: userID,
      agoraUID: agoraUID,
    });
  });

  socket.on("createRoom", async (data) => {
    const { roomID } = data;
    socket.join(roomID);

    socket.emit("roomJoined");
    await setJoinedRoom({ roomID, userID });
  });

  socket.on("joinRoom", async (data) => {
    const { roomID } = socket.handshake.auth.room;

    const room = await getRoomFromDB(roomID);

    // Room exists, proceed further.
    if (room) {
      let activeRoom;
      let user;

      try {
        // Check if room is running currently with users in it.
        console.log("Scanning for active room");
        activeRoom = await isRoomActive(roomID);
        console.log(console.log("Active room: ", activeRoom));

        // if (isRoomOverCapacity) {
        //   socket.emit("errorTriggered", {
        //     message: "The room you are trying to join is full.",
        //   });
        //   console.log("ROOM FULL".bgRed);
        //   return;
        // }

        // Create user in memory
        user = await createUserInMemory(username, socket, userID, agoraUID);
        console.log("Created user in memory: ", user.username);
        // Set current room to roomID
      } catch (error) {
        throw new Error(error);
      }

      if (!activeRoom) {
        console.log("No active room found. Creating one now..");
        //Room isn't running currently but check if it's 'joinable'.
        // If it is then add client to socket channel and to the room in memory

        if (room.joinable) {
          // Create room in memory
          const room = createRoomInMemory(roomID, rooms);
          console.log("Created room in memory: ", room);
          // Add user to room in memory
          const roomInMemory = addUserToRoomInMemory({ user, room });
          console.log("Added user to room in memory: ", roomInMemory);

          // Set roomID in currentRoom field on user model.

          // Join user to roomID channel
          socket.join(roomID);
          console.log("Joined socket to roomID: ", roomID);
          // Emit roomJoined signal for client
          socket.emit("roomJoined");
          console.log("Emitted room joined event");

          const updated = await setJoinedRoom({ roomID, userID });
          console.log("Set updated user: ", updated);
          return;
        }
      } else if (activeRoom) {
        console.log("active room found: ", activeRoom);
        // Room is currently running.

        // Push user to active room
        activeRoom.users.push(user);
        console.log("Added user to active room: ", activeRoom);
        // Join socket to channel
        socket.join(roomID);
        console.log("Joined socket to roomID: ", roomID);

        //Emit event
        socket.emit("roomJoined");
        console.log("Emitted room joined event");

        const updated = await setJoinedRoom({ roomID, userID });
        console.log("Set updated user: ", updated);

        return;
      }
    }
  });

  socket.on("init", async (data) => {});
});

app.use("/api/users/", require("./routes/userRoutes"));
app.use("/api/auth/", require("./routes/authRoutes"));
app.use("/api/room/", require("./routes/roomRoutes"));
app.use("/api/tests/", require("./routes/testRoutes"));
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
