import React from "react";

const DisplayRooms = ({ rooms }) => {
  const generateUID = () => {
    return Math.floor(Math.random() * 10000 + 1);
  };

  return (
    <ul>
      <li class="tab">Home</li>
      <li class="tab">Rooms</li>
    </ul>
  );
};

export default DisplayRooms;
