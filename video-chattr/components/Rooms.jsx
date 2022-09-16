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
import LoadingCircle from "./LoadingCircle";

const Rooms = ({ onClick }) => {
  const router = useRouter();
  const [client, setClient] = useState(false);

  const dispatch = useDispatch();
  const { rtcToken, user } = useSelector((state) => state.auth);
  const { roomName } = useSelector((state) => state.room);

  const [componentState, setComponenetState] = useState({
    isLoading: false,
  });

  const [modeState, setModeState] = useState({
    buttonMode: null,
  });

  const [roomState, setRoomState] = useState({
    roomName: null,
    joinable: null,
    exists: null,
  });

  const onBtnClick = async (obj) => {
    const API_URL = "http://localhost:8080/api/room";

    if (obj.type === "check") {
      setComponenetState((prevState) => ({
        ...prevState,
        isLoading: true,
      }));
      //* Check functionality
      //TODO call func
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };

      const payload = {
        roomName: obj.room,
      };

      console.log(config);
      console.log("REQ sent");

      try {
        const res = await axios.post(API_URL + "/verify/", payload, config);
        setComponenetState((prevState) => ({
          ...prevState,
          isLoading: false,
        }));

        if (modeState.buttonMode === "create") {
          roomState.roomName = obj.room;
          roomState.exists = true;
        }

        console.log("RES received!");
        console.log(res);
        //TODO retrieve results in some-sort of state.
        //TODO Act on that data.
      } catch (error) {
        setComponenetState((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
      }
    }

    console.log(obj);
    // onClick(obj);
  };

  return (
    //? Have func that generates dotted boxes informing user of room space.
    <>
      <div id="room-form-container">
        <div className="room-constrain">
          <h1
            className="center-text
          focus-text"
          >
            Rooms
          </h1>
        </div>
        {componentState.isLoading === true && <LoadingCircle />}
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
        <div className="room-constrain">
          <Form
            form={
              <RoomForm
                onClick={onBtnClick}
                setModeState={setModeState}
                modeState={modeState}
                roomState={roomState}
                setRoomState={setRoomState}
              />
            }
            message=""
            className="room-form"
          />
        </div>
      </div>
    </>
  );
};

export default Rooms;
