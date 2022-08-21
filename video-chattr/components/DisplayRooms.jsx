import React from "react";

const DisplayRooms = ({ rooms }) => {
  const generateUID = () => {
    return Math.floor(Math.random() * 10000 + 1);
  };

  return (
    <ul>
      {rooms.map((room) => {
        return <li key={generateUID()}>{room.roomName}</li>;
      })}
    </ul>
  );
};

export default DisplayRooms;
