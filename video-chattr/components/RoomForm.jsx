import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BsCheckCircleFill } from "react-icons/bs";

const RoomForm = ({
  onClick,
  modeState,
  setModeState,
  roomState,
  setRoomState,
  onRoomCheck,
}) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    roomID: "",
    isPublisher: true,
    isError: false,
  });
  const { roomID } = formData;

  const hasWhiteSpace = (s) => {
    if (s.indexOf(" ") >= 0) {
      return true;
    } else {
      return false;
    }
  };

  const onChange = (e) => {
    if (hasWhiteSpace(e.target.value)) {
      return;
    }
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    console.log("submmit click");
    e.preventDefault();
    if (!roomID) {
      setFormData((prevState) => ({
        ...prevState,
        isError: true,
      }));
      return;
    } else {
      setFormData((prevState) => ({
        ...prevState,
        isError: false,
      }));
    }
  };

  const onFormClick = (e) => {
    if (e.target.id === "create" || e.target.id === "join") {
      setModeState((prevState) => ({
        ...prevState,
        buttonMode: e.target.id,
      }));
    }

    if (e.target.id === "check") {
      if (!roomID) {
        setFormData((prevState) => ({
          ...prevState,
          isError: true,
        }));
        return;
      } else {
        setFormData((prevState) => ({
          ...prevState,
          isError: false,
        }));
      }
      onClick({ type: e.target.id, room: roomID });
    }
    console.log("form click");
  };

  return (
    <>
      <form onSubmit={onSubmit} className="form-control">
        <div>
          <p className="space-text">Room ID</p>
          <input
            type="text"
            className={`${
              formData.isError ? "error_input form-input" : "form-input"
            }`}
            id="roomID"
            value={roomID}
            onChange={onChange}
            placeholder="Enter room name"
            maxLength="10"
          />
        </div>
        <div className="btn-wrapper">
          <button
            id="create"
            type="button"
            class={`${
              modeState.buttonMode === "create" ? "btn_blue" : "btn_off"
            }`}
            onClick={onFormClick}
          >
            Create Mode
          </button>
          <button
            id="join"
            type="button"
            class={`${
              modeState.buttonMode === "join" ? "btn_blue" : "btn_off"
            }`}
            onClick={onFormClick}
          >
            Join Mode
          </button>
        </div>
        <div className="long-btn">
          <button id="check" type="button" onClick={onFormClick}>
            Check
          </button>
        </div>
        <div className="room-constrain" id="room-form-info">
          <ul>
            <li>
              <BsCheckCircleFill
                className={`${roomState.exists ? "error_svg" : null}`}
              />
              {
                // If null
                modeState.buttonMode === null ? (
                  <>
                    <p className={`${roomState.exists ? "" : ""}`}>Exists</p>
                  </>
                ) : // If create mode is on
                modeState.buttonMode === "create" ? (
                  <>
                    <p className={`${roomState.exists ? "" : ""}`}>Exists</p>
                  </>
                ) : (
                  modeState.buttonMode === "join" && (
                    <>
                      <p className={`${roomState.exists ? "" : ""}`}>Exists</p>
                    </>
                  )
                )
              }
            </li>
            <li></li>
          </ul>
        </div>
      </form>
    </>
  );
};

export default RoomForm;
