import { useState } from "react";
import { useSelector } from "react-redux";
import Form from "./Form";
import RoomForm from "./RoomForm";
import LoadingCircle from "./LoadingCircle";

const Rooms = ({ onClick }) => {
  const { isLoading } = useSelector((state) => state.room);

  const [componentState, setComponenetState] = useState({
    isLoading: false,
  });

  const [modeState, setModeState] = useState({
    buttonMode: null,
    executePressed: true,
  });

  const [roomState, setRoomState] = useState({
    roomName: null,
    joinable: null,
    exists: null,
  });

  const onBtnClick = async ({ roomName }) => {
    if (modeState.executePressed) {
      setComponenetState((prevState) => ({
        ...prevState,
        isLoading: true,
      }));

      // console.log(config);
      // console.log("REQ sent");

      //* Check functionality
      try {
        setRoomState((prevState) => ({
          ...prevState,
          roomName,
          exists: null,
        }));

        console.log("RES received!");
      } catch (error) {
        setComponenetState((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
      }
    }

    console.log("%c Sending data upstairs...", "color: #4ce353");
    const upstairsPayload = {
      userInput: roomName,
      buttonMode: modeState.buttonMode,
    };
    onClick(upstairsPayload);
  };

  return (
    //? Have func that generates dotted boxes informing user of room space.
    <>
      <div id="room-form-container" className="panel">
        <div className="room-constrain">
          <h1
            className="center-text
          focus-text"
          >
            Rooms
          </h1>
        </div>
        {isLoading && <LoadingCircle />}
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
        {
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
        }
      </div>
    </>
  );
};

export default Rooms;
