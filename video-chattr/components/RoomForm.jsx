import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const RoomForm = ({ onClick }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ roomID: "", isPublisher: true });
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
  };

  const onFormClick = (e) => {
    console.log(roomID);
    if (!roomID) {
      return;
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
            className="form-input"
            id="roomID"
            value={roomID}
            onChange={onChange}
            placeholder="Enter room name"
            maxLength="7"
          />
        </div>
        <div className="btn-wrapper">
          <button
            id="create"
            type="submit"
            class="btn_blue"
            onClick={onFormClick}
          >
            Create Room
          </button>
          <button
            id="join"
            type="submit"
            class="btn_blue"
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
