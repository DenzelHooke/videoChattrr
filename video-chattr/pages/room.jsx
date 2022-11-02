import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { setLoading, stopLoading } from "../features/room/roomSlice";
import { removeToken } from "../features/auth/authSlice";
import { resetRoomState } from "../features/room/roomSlice";
import { toast } from "react-nextjs-toast";

import RoomClient from "../helpers/RoomsClass";
import LoadingCircle from "../components/LoadingCircle";
import Video from "../components/Video";
import io from "socket.io-client";
import { wrapper } from "../app/store";
import { removeRoomCookie } from "../helpers/RoomsFuncs";
import { saveRoom } from "../features/room/roomSlice";

/**
 * A room page for generating video call enviroments.
 * @param {object} Data
 * @returns
 */
const room = ({ mode, rtcToken }) => {
  const { uid, user } = useSelector((state) => state.auth);
  const { roomName, roomID, isLoading, message, isError } = useSelector(
    (state) => state.room
  );

  let _roomClient;

  const socketRef = useRef();
  const router = useRouter();
  const dispatch = useDispatch();
  const isServer = typeof window === "undefined";

  const [socketState, setSocketState] = useState({
    socketStateMessage: "",
    isSocketStateError: false,
  });
  const [roomState, setRoomState] = useState({
    saveVideo: false,
  });

  const { socketStateMessage, isSocketStateError } = socketState;

  const cleanUp = () => {
    console.log("Room client: ", _roomClient);
    socketRef.current.disconnect();
    console.info("Cleaning up now..");
    _roomClient.removeLocalStream();
    _roomClient.reset();

    //Removes the user token on page dismount because the state persits unless page is refreshed.
    dispatch(removeToken());
    dispatch(resetRoomState());
    removeRoomCookie();
    location.reload();
  };

  // useEffect(() => {
  //   if(roomState === false) {

  //   }
  // }, [roomState])

  /**
   * Initializes my Agora room connection class wrapper
   */
  const setUpClient = async (roomID) => {
    _roomClient = new RoomClient(roomID, uid, user.username);
    _roomClient.init(rtcToken);
    dispatch(setLoading(false));
  };

  const onIconClick = (e) => {
    console.log(roomState.saveVideo);
    console.log(e.target.id);
    if (e.target.id === "saveVideo") {
      console.log("Pinning on server");
      dispatch(
        saveRoom({
          roomID,
          userID: user._id,
          bool: !roomState.saveVideo,
          user,
        })
      );

      setRoomState((prevState) => ({
        ...prevState,
        [e.target.id]: !roomState.saveVideo,
      }));
    }
  };

  useEffect(() => {
    if (isError && message) {
      toast.notify(message, {
        title: "An error has occured.",
        type: "error",
        duration: 5,
      });
      console.trace("isError: ", message);
      cleanUp();
      router.push("/dashboard");
      return;
    }

    if (isSocketStateError && socketStateMessage) {
      toast.notify(socketStateMessage, {
        title: "An error has occured.",
        type: "error",
        duration: 5,
      });
      console.trace("socketError: ", socketStateMessage);
      cleanUp();
      router.push("/dashboard");
      setSocketState({ socketStateMessage: "", isSocketStateError: false });
      return;
    }
  }, [isError, message, isSocketStateError, socketStateMessage]);

  useEffect(() => {
    if (!rtcToken) {
      // No RTC found, push client to dashboard
      toast.notify("You do not have permission to view this page.", {
        title: "An error has occured.",
        type: "error",
        duration: 5,
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
          agoraUID: uid,
        },
      });

      // On error trigger from server
      socketRef.current.on("errorTriggered", (data) => {
        setSocketState((prevState) => ({
          ...prevState,
          socketStateMessage: data.message,
          isSocketStateError: true,
        }));
      });

      // On client room join
      socketRef.current.on("roomJoined", () => {
        console.log(rtcToken, roomID);
        //* Start Agora
        setUpClient(roomID);
        console.log("_______ROOM JOINED_______");
        //* INIT socket.io connection to server
      });

      // On remote user leaving
      socketRef.current.on("userLeft", (user) => {
        try {
          _roomClient.removeRemoteStream(user.agoraUID);
          //* Execute remove user from dom func
          console.log("USER LEFT: ", user);

          //* Execute unsubscribing user on Agora.
        } catch (error) {
          console.error(error);
        }
      });

      if (mode === "create" && roomID) {
        // If room is set to create:
        console.log("roomID: ", roomID);
        socketRef.current.emit("createRoom", {
          roomID: roomID,
        });
      } else if (mode === "join" && roomID) {
        // If room is set to join:
        socketRef.current.emit("joinRoom", {
          roomID: roomID,
        });
      } else {
        console.error("No mode was set during transfer room page.");
      }
    }
  }, [rtcToken, isServer, roomID]);

  useEffect(() => {
    dispatch(setLoading(true));

    return () => cleanUp();
  }, []);

  const leaveRoom = () => {
    console.log("Room client before cleanup: ", _roomClient);
    router.push("/dashboard");
  };

  return (
    <div>
      {isServer ? (
        <LoadingCircle />
      ) : (
        <>
          <div id="room-container" className="grow">
            {!isLoading && (
              <Video
                leaveRoom={leaveRoom}
                onIconClick={onIconClick}
                roomState={roomState}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

//! Make this page private

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ res, req }) => {
      try {
        let { roomData } = req.cookies;
        roomData = JSON.parse(roomData);

        return {
          props: {
            mode: roomData.mode,
            rtcToken: roomData.rtcToken,
          },
        };
      } catch (error) {
        return {
          redirect: {
            destination: "/dashboard",
            permanent: false,
          },
        };
      }
    }
);

export default room;
