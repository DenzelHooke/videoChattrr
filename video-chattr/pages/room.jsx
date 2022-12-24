import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { setLoading } from "../features/room/roomSlice";
import { removeToken } from "../features/auth/authSlice";
import { resetRoomState } from "../features/room/roomSlice";

import LoadingCircle from "../components/LoadingCircle";
import Video from "../components/Video";
import io from "socket.io-client";
import { wrapper } from "../app/store";
import { removeRoomCookie } from "../helpers/RoomsFuncs";
import { saveRoom } from "../features/room/roomSlice";
import { setError, setPage } from "../features/utils/utilsSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import NoSSRWrapper from "../components/noSSR";
var RoomClient;

/**
 * A room page for generating video call enviroments.
 * @param {object} Data
 * @returns
 */

export default function Room() {
  const isServer = typeof window === "undefined";

  const SOCKET_URI =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_SOCKET_URL
      : process.env.NEXT_PUBLIC_DEVELOPMENT_SOCKET_URL;

  const { uid, user } = useSelector((state) => state.auth);
  const { roomID, isLoading, message, isError } = useSelector(
    (state) => state.room
  );

  const [_roomClient, setRoomClient] = useState();
  const [mode, setMode] = useState(false);
  const [rtcToken, setRtcToken] = useState(false);
  const socketRef = useRef();
  const router = useRouter();
  const dispatch = useDispatch();
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

  useEffect(() => {
    // Import module when page loads
    import("../helpers/RoomsClass").then((module) => {
      RoomClient = module.default;
      console.log("MOD:", RoomClient);
    });

    dispatch(setPage({ page: "room" }));
    dispatch(setLoading(true));
    console.log("Listener set");
    window.addEventListener("beforeunload", cleanUp);

    let roomData = Cookies.get("roomData");
    roomData = JSON.parse(roomData);
    try {
      setMode(roomData.mode);
      setRtcToken(roomData.rtcToken);
      console.log(roomData);
    } catch (error) {
      console.error("No rtc token", roomData);
      setError({ message: "You are not authorized to view this page." });
    }

    return () => removeListeners();
  }, []);

  const cleanUp = (_roomClient) => {
    dispatch(setPage({ page: "" }));
    console.info("Cleaning up now..");
    try {
      removeRoomCookie();
      console.log("Room client: ", _roomClient);
      socketRef.current.disconnect();
      console.log("before removeLocal");
      _roomClient.removeLocalStream();
      console.log("after removeLocal");
      _roomClient.reset();

      //Removes the user token on page dismount because the state persits unless page is refreshed.
      dispatch(removeToken());
      dispatch(resetRoomState());
      // location.reload();
      console.log("room client at end of cleanUp: ", _roomClient);
    } catch (error) {
      console.log(error);
      dispatch(setError({ message: `${error.message}` }));
    }
  };

  const removeListeners = () => {
    cleanUp();
    window.removeEventListener("beforeunload", cleanUp);
  };

  /**
   * Initializes my Agora room connection class wrapper
   */
  const setUpClient = (roomID) => {
    console.log("client: ");

    const cli = new RoomClient(roomID, uid, user.username);
    setRoomClient(cli);
    return;
  };

  const leaveRoom = () => {
    console.log("Room client before cleanup: ", _roomClient);
    router.push("/dashboard");
  };

  const onUserLeft = (user) => {
    try {
      console.log("Room client userLeft: ", _roomClient);
      console.log("USER LEFT: ", user);
      _roomClient.removeRemoteStream(user.agoraUID);
      console.log("after removeRemoteSTream");
      // //* Execute unsubscribing user on Agora.
    } catch (error) {
      console.error(error);
      dispatch(setError({ message: `${error.message}` }));
    }
  };

  const onIconClick = async (e) => {
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
      try {
        const muteStatus = await _roomClient.muteLocal();

        // Send to server
        socketRef.current.emit("setMute", { id: uid, state: muteStatus });
      } catch (error) {
        dispatch(setError({ message: error }));
      }
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
    if (!_roomClient || !rtcToken) {
      return;
    }

    socketRef.current.on("userLeft", onUserLeft);
    console.log("CLIENT LIVE", _roomClient);

    _roomClient.init(rtcToken);
    dispatch(setLoading(false));

    return () => cleanUp(_roomClient);
  }, [_roomClient]);

  useEffect(() => {
    if (!rtcToken) {
      return;
    }

    if (isError && message) {
      dispatch(setError({ message: message }));
      console.trace("isError: ", message);
      cleanUp();
      router.push("/dashboard");
      return;
    }

    if (isSocketStateError && socketStateMessage) {
      dispatch(setError({ message: socketStateMessage }));
      console.trace("socketError: ", socketStateMessage);
      cleanUp();
      router.push("/dashboard");
      setSocketState({ socketStateMessage: "", isSocketStateError: false });
      return;
    }
  }, [isError, message, isSocketStateError, socketStateMessage]);

  useEffect(() => {
    if (!rtcToken) {
      return;
    }

    if (!isServer) {
      //Can't run on server side so we have to run this only when the page completes SSR.
      console.log("MODE: ", mode);

      //Connect to socket server
      socketRef.current = io.connect(SOCKET_URI, {
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

      console.log(socketRef.current);

      socketRef.current.on("userMute", (data) => {
        const { id, state } = data;
        console.log("MUTE EVENT: ", data);
        const element = document.querySelector(`[id='${id}']`);

        if (state) {
          console.log("state true");
          console.log(element);
          element.classList.add("muted");
        } else {
          console.log("state false");
          element.classList.remove("muted");
        }
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
      socketRef.current.on("roomJoined", async () => {
        console.log(rtcToken, roomID);
        //* Start Agora
        console.log("joining room");
        setUpClient(roomID);
        console.log("_______ROOM JOINED_______");
        //* INIT socket.io connection to server
      });
    }
  }, [rtcToken, isServer, roomID]);

  useEffect(() => {
    if (!rtcToken) {
      return;
    }

    if (rtcToken) {
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
  }, [rtcToken]);

  return (
    <NoSSRWrapper>
      {
        <>
          {isServer ? (
            <LoadingCircle />
          ) : (
            <>
              <div id="room-container" className="grow">
                {!isLoading ? (
                  <Video
                    leaveRoom={leaveRoom}
                    onIconClick={onIconClick}
                    roomState={roomState}
                    buttonState={buttonState}
                  />
                ) : (
                  ""
                )}
              </div>
            </>
          )}
        </>
      }
    </NoSSRWrapper>
  );
}

//! Make this page private
