import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { removeToken } from "../features/auth/authSlice";
import RoomClient from "../helpers/RoomsClass";
import Video from "../components/Video";

const room = ({ data }) => {
  const { rtcToken, uid } = useSelector((state) => state.auth);
  const { roomName } = useSelector((state) => state.room);

  const router = useRouter();
  const dispatch = useDispatch();

  const cleanUp = () => {
    //Removes the user token on page dismount because the state persits unless page is refreshed.
    dispatch(removeToken());
  };

  const setUpClient = async () => {
    const videoClient = new RoomClient(roomName, uid);
    await videoClient.init(rtcToken);
  };

  useEffect(() => {
    return () => cleanUp();
  }, []);

  useEffect(() => {
    if (!rtcToken) {
      router.push("/dashboard");
      return;
    }

    // const { roomID, token } = router.query;
    // setUpClient(rtcToken, roomName);

    //Connect client to room
    // dispatch(initAgora());
    // create vid feed.

    // accept other client feeds
  }, [rtcToken]);

  return (
    <div id="room-container" className="grow">
      <Video roomName={roomName} />
    </div>
  );
};

export default room;
