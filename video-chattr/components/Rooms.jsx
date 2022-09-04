import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { reset, genRTC } from "../features/auth/authSlice";
import RtcUser from "./video/videoFuncs";
import Form from "./Form";
import RoomForm from "./RoomForm";
import { GrGroup } from "react-icons/gr";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";
import { useRouter } from "next/router";
import { setRoom } from "../features/room/roomSlice";
import { AiFillDelete } from "react-icons/ai";

const Rooms = ({ onClick }) => {
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

  return (
    //? Have func that generates dotted boxes informing user of room space.
    <>
      <div id="room-form-container">
        <h1
          className="center-text
        focus-text"
        >
          Rooms
        </h1>
        {/* <div className="savedRooms">
          <h3 className="center">SAVED ROOMS</h3>
          <div className="wrapper">
            <div className="saved-room saved">
              <div className="utils">
                <p>CoolR..</p>
                <div className="btn delete">X</div>
              </div>
              <div className="btn-wrapper">
                <button className="join true">JOIN</button>
              </div>
            </div>
            <div className="saved-room saved">
              <div className="utils">
                <p>CoolR..</p>
                <div className="btn delete">X</div>
              </div>
            </div>
            <div className="saved-room not-saved">
              <div className="utils">
                <p>CoolR..</p>
                <div className="btn delete">X</div>
              </div>
            </div>
          </div>
        </div> */}
        <Form
          form={<RoomForm onClick={onClick} />}
          message=""
          className="room-form"
        />
      </div>
    </>
  );
};

export default Rooms;
