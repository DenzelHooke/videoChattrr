import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BsCheckCircleFill } from "react-icons/bs";

const RoomForm = ({ onClick, modeState, setModeState, onRoomCheck }) => {
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
    setModeState((prevState) => ({
      ...prevState,
      buttonMode: e.target.id,
    }));

    //* Check functionality
    if (e.target.id === "check") {
      console.log("Check block");

      //TODO call DB

      //TODO retrieve results in some-sort of state.

      //TODO Act on that data.
    }
    console.log("form click");
    // onClick({ type: e.target.id, room: roomID });
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
              <BsCheckCircleFill />
              <p>Exists</p>
            </li>
            <li></li>
          </ul>
        </div>
      </form>
    </>
  );
};

export default RoomForm;
