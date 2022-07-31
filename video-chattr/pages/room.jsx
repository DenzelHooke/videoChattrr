import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { removeToken } from "../features/auth/authSlice";
import RoomClient from "../helpers/RoomsClass";

const room = ({ data }) => {
  const { rtcToken, uid } = useSelector((state) => state.auth);
  const { roomName } = useSelector((state) => state.room);

  const router = useRouter();
  const dispatch = useDispatch();

  const cleanUp = () => {
    dispatch(removeToken());
  };

  const setUpClient = async (token, roomID) => {
    const videoClient = new RoomClient(roomID, uid);
    await videoClient.init(token);
  };

  useEffect(() => {
    return () => cleanUp();
  }, []);

  useEffect(() => {
    if (!rtcToken) {
      router.push("/dashboard");
      return;
    }

    const { roomID, token } = router.query;
    setUpClient(token, roomID);

    //Connect client to room
    // dispatch(initAgora());
    // create vid feed.

    // accept other client feeds
  }, [rtcToken]);

  return (
    <div id="room-container">
      <div className="container">
        <div>
          <span className="room-name">{roomName}</span>
        </div>
        <div className="video-feed"></div>
      </div>
    </div>
  );
};

export default room;
