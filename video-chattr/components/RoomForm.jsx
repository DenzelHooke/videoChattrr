import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const RoomForm = ({ onClick, modeState }) => {
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
    e.preventDefault();
    if (!roomID) {
      setFormData((prevState) => ({
        ...prevState,
        isError: true,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        isError: false,
      }));
    }
  };

  const onFormClick = (e) => {
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
  };

  return (
    <>
      <form onSubmit={onSubmit} className="form-control">
        <div>
          <p className="space-text">Room name</p>
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
            type="submit"
            class={`${
              modeState.buttonMode === "create" ? "btn_blue" : "btn_off"
            }`}
            onClick={onFormClick}
          >
            Create Room
          </button>
          <button
            id="join"
            type="submit"
            class={`${
              modeState.buttonMode === "join" ? "btn_blue" : "btn_off"
            }`}
            onClick={onFormClick}
          >
            Join Room
          </button>
        </div>
      </form>
    </>
  );
};

export default RoomForm;
