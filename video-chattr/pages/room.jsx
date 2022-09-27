import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { setLoading, stopLoading } from "../features/room/roomSlice";
import { removeToken } from "../features/auth/authSlice";
import { reset } from "../features/room/roomSlice";

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
const room = ({ data }) => {
  const { rtcToken, uid, user } = useSelector((state) => state.auth);
  const { roomName, roomID, mode, isLoading } = useSelector(
    (state) => state.room
  );
  const socketRef = useRef();
  const router = useRouter();
  const dispatch = useDispatch();
  const isServer = typeof window === "undefined";

  const cleanUp = () => {
    //Removes the user token on page dismount because the state persits unless page is refreshed.
    dispatch(removeToken());
    dispatch(reset());
  };

  /**
   * Initializes my Agora room connection class wrapper
   */
  const setUpClient = async () => {
    const videoClient = new RoomClient(roomID, uid);
    await videoClient.init(rtcToken);
  };

  useEffect(() => {
    if (!rtcToken) {
      router.push("/dashboard");
    }

    return () => {
      cleanUp();
    };
  }, []);

  useEffect(() => {
    if (!isServer) {
      //Can't run on server side so we have to run this only when the page completes SSR.

      //* Start Agora
      // setUpClient(rtcToken, roomName);
      //* INIT socket.io connection to server
      dispatch(setLoading(true));

      if (isLoading) {
        socketRef.current = io.connect(process.env.NEXT_PUBLIC_BACKEND_URL, {
          auth: {
            token: user.token,
            user: {
              userID: user.id,
              username: user.username,
            },
          },
        });

        if (mode === "create") {
          socketRef.current.emit("createRoom", {
            roomID: roomID,
          });

          socketRef.current.on("roomCreated", async () => {
            await setUpClient();
          });
        }

        // TODO Connect to socket channel
        // socketRef.current.emit("joinRoom", {
        //   username: user.username,
        //   roomID,
        //   userID: user._id,
        // });
      }
    }
  }, [rtcToken, isServer]);

  useEffect(() => {
    return () => dispatch(removeToken());
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingCircle />
      ) : (
        <div id="room-container" className="grow">
          <Video roomName={roomName} />
        </div>
      )}
    </>
  );
};

//! Make this page private

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (req, res) => {
    console.log(store);
  }
);

export default room;
