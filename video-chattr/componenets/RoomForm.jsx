import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { genRTC } from "../features/auth/authSlice";

const RoomForm = () => {
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
    console.log("submit pressed");
    dispatch(genRTC(formData));
  };

  const createRoom = (e) => {
    console.log("Creating room.");
  };

  const joinRoom = (e) => {
    console.log("Joining room.");
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
        type="submit"
        id="create"
        onClick={createRoom}
      >
        Create Room
      </button>
      <button className="yellowish" type="submit" id="join" onClick={joinRoom}>
        Join Room
      </button>
    </form>
  );
};

export default RoomForm;
