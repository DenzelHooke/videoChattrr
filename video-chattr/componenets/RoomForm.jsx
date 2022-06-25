import { useEffect, useState } from "react";

const RoomForm = () => {
  const [formData, setFormData] = useState({ roomID: null });
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
    </form>
  );
};

export default RoomForm;
