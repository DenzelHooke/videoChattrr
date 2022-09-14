import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { removeToken } from "../features/auth/authSlice";
import RoomClient from "../helpers/RoomsClass";
import Video from "../components/Video";
import io from "socket.io-client";

/**
 * A room page for generating video call enviroments.
 * @param {object} Data
 * @returns HTML
 */
const room = ({ data }) => {
  const { rtcToken, uid } = useSelector((state) => state.auth);
  const { roomName } = useSelector((state) => state.room);
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
    const videoClient = new RoomClient(roomName, uid);
    await videoClient.init(rtcToken);
  };

  useEffect(() => {
    return () => {
      cleanUp();
    };
  }, []);

  useEffect(() => {
    if (!isServer) {
      //Can't run on server side so we have to run this only when the page completes SSR.
      //* Start Agora
      setUpClient(rtcToken, roomName);
    }
  }, [rtcToken, isServer]);

  useEffect(() => {
    //* INIT socket.io connection to server
    socketRef.current = io.connect("http://localhost:8080");
  }, []);

  return (
    <div id="room-container" className="grow">
      <Video roomName={roomName} />
    </div>
  );
};

//! Make this page private

export default room;
