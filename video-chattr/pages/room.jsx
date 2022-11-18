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
import { setError } from "../features/utils/utilsSlice";
import { unwrapResult } from "@reduxjs/toolkit";

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

  const [_roomClient, set_roomClient] = useState(null);

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

  const [buttonState, setButtonState] = useState({
    muteAudio: false,
    hideVideo: false,
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

  /**
   * Initializes my Agora room connection class wrapper
   */
  const setUpClient = async (roomID) => {
    set_roomClient(new RoomClient(roomID, uid, user.username));
  };

  const onIconClick = (e) => {
    const targetName = e.target.id;

    //Runs when icons are clicked on the video call page
    if (targetName === "saveVideo") {
      // If saveVideo button was pressed
      try {
        //Call dispatch action to send request to backend
        dispatch(
          saveRoom({
            roomID,
            userID: user._id,
            bool: !roomState.saveVideo,
            user,
          })
        )
          .then(unwrapResult)
          .catch((error) => dispatch(setError({ message: `${error}` })));

        // Set room to true or false depending on prior result.
        setRoomState((prevState) => ({
          ...prevState,
          [targetName]: !roomState.saveVideo,
        }));
      } catch (error) {
        console.log("ERROR");
        dispatch(setError({ message: `${error}` }));
      }
    }

    if (targetName === "muteAudio") {
      console.log(!buttonState.muteAudio);
      setButtonState((prevState) => ({
        ...prevState,
        muteAudio: !prevState.muteAudio,
      }));
      _roomClient.muteLocal();
    }

    if (targetName === "hideVideo") {
      console.log(!buttonState.hideVideo);
      setButtonState((prevState) => ({
        ...prevState,
        hideVideo: !prevState.hideVideo,
      }));
      _roomClient.hideCameraLocal();
    }
  };

  useEffect(() => {
    if (!_roomClient) {
      return;
    }
    console.log("CLIENT LIVE", _roomClient);

    _roomClient.init(rtcToken);
    dispatch(setLoading(false));
  }, [_roomClient]);

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
      dispatch(
        setError({
          message: "Please log in before viewing this page.",
          push: "/dashboard",
        })
      );
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
          dispatch(setError({ message: `${error}` }));
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
                buttonState={buttonState}
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
