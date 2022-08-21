import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { reset, genRTC } from "../features/auth/authSlice";
import RtcUser from "./video/videoFuncs";
import Form from "./Form";
import RoomForm from "./RoomForm";
import { FaHotdog } from "react-icons/fa";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";
import { useRouter } from "next/router";
import { setRoom } from "../features/room/roomSlice";

const Rooms = () => {
  const router = useRouter();
  const [client, setClient] = useState(false);

  const dispatch = useDispatch();
  const { rtcToken, user } = useSelector((state) => state.auth);
  const { roomName } = useSelector((state) => state.room);

  useEffect(() => {
    if (rtcToken) {
      router.push({
        pathname: "/room",
        query: { roomID: roomName, token: rtcToken },
      });
    }
  }, [rtcToken, roomName]);

  const onClick = async ({ type, room }) => {
    const btnType = type.toLowerCase();
    if (btnType !== "create" && btnType !== "join") {
      return;
    }
    const data = { roomID: room };
    // Create rtcToken
    dispatch(genRTC(data)).then(() => dispatch(setRoom(room)));

    //Connect to room or create room.
  };

  return (
    <div id="room-add-form">
      <Form
        form={<RoomForm onClick={onClick} />}
        message="Enter a room ID"
        svg={<FaHotdog />}
        className="room-form"
      />
    </div>
  );
};

export default Rooms;
