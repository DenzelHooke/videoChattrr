import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const RoomForm = ({ onClick }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ roomID: "", isPublisher: true });
  const { roomID } = formData;

  const onChange = (e) => {
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
    <form onSubmit={onSubmit} className="form-control">
      <input
        type="text"
        className="form-input"
        id="roomID"
        value={roomID}
        onChange={onChange}
        placeholder="Room ID"
      />
      <button
        className="success"
        id="create"
        type="submit"
        onClick={onFormClick}
      >
        Create Room
      </button>
      <button
        className="yellowish"
        id="join"
        type="submit"
        onClick={onFormClick}
      >
        Join Room
      </button>
    </form>
  );
};

export default RoomForm;
