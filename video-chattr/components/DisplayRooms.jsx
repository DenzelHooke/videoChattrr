import { useState, useEffect } from "react";
import axios from "axios";

const DisplayRooms = () => {
  const API_URL =
    process.env.NODE_ENV === "production"
      ? ""
      : process.env.NEXT_PUBLIC_ROOM_API;

  const generateUID = () => {
    return Math.floor(Math.random() * 10000 + 1);
  };

  const [rooms, setRooms] = useState([
    {
      roomName: "Test Room 1",
    },
    {
      roomName: "Study room",
    },
  ]);

  const getRooms = async () => {
    axios.get();
  };

  useEffect(() => {}, []);

  return (
    <>
      <div className="displayRoomContainer">
        <p>
          <h3>My Rooms</h3>
        </p>
        <ul>
          {rooms.map((item) => (
            <>
              <li key={generateUID()}>{item.roomName}</li>
            </>
          ))}
        </ul>
      </div>
    </>
  );
};

export default DisplayRooms;
