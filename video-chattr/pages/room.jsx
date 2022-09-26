import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  removeToken,
  setLoading,
  stopLoading,
} from "../features/auth/authSlice";
import RoomClient from "../helpers/RoomsClass";
import LoadingCircle from "../components/LoadingCircle";
import Video from "../components/Video";
import io from "socket.io-client";
import axios from "axios";

/**
 * A room page for generating video call enviroments.
 * @param {object} Data
 * @returns HTML
 */
const room = () => {
  const { rtcToken, uid } = useSelector((state) => state.auth);
  const { roomName, roomID, isLoading } = useSelector((state) => state.room);
  const socketRef = useRef();
  const router = useRouter();
  const dispatch = useDispatch();
  const isServer = typeof window === "undefined";

  const cleanUp = () => {
    //Removes the user token on page dismount because the state persits unless page is refreshed.
    dispatch(removeToken());
  };

  /**
   * Initializes my Agora room connection class wrapper
   *
   * @param "None"
   * @return "None"
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
      socketRef.current = io.connect(process.env.NEXT_PUBLIC_BACKEND_URL);

      // TODO Connect to socket channel
      // socketRef.current.emit("joinRoom", {
      //   username: user.username,
      //   roomID,
      //   userID: user._id,
      // });
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

export const getServerSideProps = async (res, req) => {
  console.log(req);

  // const user = req.cookies.user;
  // const { token } = user;
  // const config = {
  //   headers: {
  //     authorization: `Bearer: ${token}`,
  //   },
  // };
  console.log(res.cookies);
  return {
    props: { test: "d" },
  };
};

export default room;
