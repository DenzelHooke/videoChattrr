import React from "react";
import Form from "./Form";
import RoomForm from "./RoomForm";
import { FaHotdog } from "react-icons/fa";

const Rooms = () => {
  return (
    <div id="room-add-form">
      <Form
        form={<RoomForm />}
        message="Enter a room ID"
        svg={<FaHotdog />}
        className="room-form"
      />
    </div>
  );
};

export default Rooms;
