import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { setLoading, stopLoading } from "../features/room/roomSlice";
import { removeToken } from "../features/auth/authSlice";
import { reset } from "../features/room/roomSlice";
import { toast } from "react-nextjs-toast";

import RoomClient from "../helpers/RoomsClass";
import LoadingCircle from "../components/LoadingCircle";
import Video from "../components/Video";
import io from "socket.io-client";
import axios from "axios";
import { wrapper } from "../app/store";

/**
 * A room page for generating video call enviroments.
 * @param {object} Data
 * @returns HTML
 */
const room = ({ mode, rtcToken }) => {
  const { uid, user } = useSelector((state) => state.auth);
  const { roomName, roomID, isLoading, message, isError } = useSelector(
    (state) => state.room
  );
  const socketRef = useRef();
  const router = useRouter();
  const dispatch = useDispatch();
  const isServer = typeof window === "undefined";

  const [socketState, setSocketState] = useState({
    socketStateMessage: "",
    isSocketStateError: false,
  });

  const { socketStateMessage, isSocketStateError } = socketState;

  const cleanUp = () => {
    console.info("Cleaning up now..");
    // socketRef.current.emit("removeUser", {
    //   roomID,
    // });
    socketRef.current.disconnect();

    //Removes the user token on page dismount because the state persits unless page is refreshed.
    dispatch(removeToken());
    dispatch(reset());
  };

  /**
   * Initializes my Agora room connection class wrapper
   */
  const setUpClient = async (rtcToken, roomID) => {
    const videoClient = new RoomClient(roomID, uid);
    await videoClient.init(rtcToken);
    dispatch(setLoading(false));
  };

  useEffect(() => {
    if (isError && message) {
      toast.notify(message, {
        title: "An error has occured.",
        type: "error",
        duration: 5,
      });
      cleanUp();
      router.push("/dashboard");
      return;
    }

    if (isSocketStateError && socketStateMessage) {
      toast.notify(socketStateMessage, {
        title: "An error has occured.",
        type: "error",
        duration: 3,
      });
      cleanUp();
      router.push("/dashboard");
      setSocketState({ socketStateMessage: "", isSocketStateError: false });
      return;
    }
  }, [isError, message, isSocketStateError, socketStateMessage]);

  useEffect(() => {
    if (!rtcToken) {
      toast.notify("You do not have permission to view this page.", {
        title: "Error",
        type: "error",
      });
      router.push("/dashboard");
      console.error("No RTC token found! Sending back to dashboard.");
      return;
    }

    if (!isServer) {
      //Can't run on server side so we have to run this only when the page completes SSR.
      console.log("MODE: ", mode);
      // TODO Connect to socket channel

      //Connect to socket server
      socketRef.current = io.connect(process.env.NEXT_PUBLIC_BACKEND_URL, {
        auth: {
          token: user.token,
          room: {
            roomID: roomID,
          },
          user: JSON.stringify({
            userID: user._id,
            username: user.username,
          }),
        },
      });

      socketRef.current.on("errorTriggered", (data) => {
        setSocketState((prevState) => ({
          ...prevState,
          socketStateMessage: data.message,
          isSocketStateError: true,
        }));
      });

      socketRef.current.on("roomJoined", () => {
        console.log(rtcToken, roomID);
        //* Start Agora
        setUpClient(rtcToken, roomID);
        console.log("_______ROOM JOINED_______");
        //* INIT socket.io connection to server
      });

      if (mode === "create" && roomID) {
        console.log("roomID: ", roomID);
        socketRef.current.emit("createRoom", {
          roomID: roomID,
        });
      } else if (mode === "join" && roomID) {
        socketRef.current.emit("joinRoom", {
          roomID: roomID,
        });
      }
    }
  }, [rtcToken, isServer, roomID]);

  useEffect(() => {
    dispatch(setLoading(true));

    return () => {
      cleanUp();
      socketRef.current.disconnect();
    };
  }, []);

  return isServer ? (
    <>
      <LoadingCircle />
    </>
  ) : (
    <>
      <div id="room-container" className="grow">
        {isLoading ? <LoadingCircle /> : <Video roomName={roomName} />}
      </div>
    </>
  );
};

//! Make this page private

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ res, req }) => {
      let { roomData } = req.cookies;
      roomData = JSON.parse(roomData);

      return {
        props: {
          mode: roomData.mode,
          rtcToken: roomData.rtcToken,
        },
      };
    }
);

export default room;
