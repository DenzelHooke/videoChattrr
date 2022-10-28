import { useState, useEffect } from "react";
import axios from "axios";

import { MdCancel } from "react-icons/md";
import { IoCheckmarkCircle } from "react-icons/io5";
import SidebarList from "./SidebarList";

const Sidebar = () => {
  const API_URL =
    process.env.NODE_ENV === "production"
      ? ""
      : process.env.NEXT_PUBLIC_ROOM_API;

  const [rooms, setRooms] = useState([
    {
      roomName: "Test Room 1",
    },
    {
      roomName: "Study room",
    },
  ]);

  const testData = {
    rooms: {
      arr: [
        {
          value1: "TestRoom",
        },
        {
          value1: "Daily Stand up",
        },
      ],
      options: {
        btn1: "Join",
        btn2: "Untrack",
      },
    },
  };

  const getRooms = async () => {
    axios.get();
  };

  useEffect(() => {
    // TODO Fetch new rooms
  }, []);

  return (
    <>
      <div id="saved-rooms-wrapper" className="sidebar-section">
        <p>
          <h3>Saved Rooms</h3>
        </p>
        <SidebarList data={testData["rooms"]} />
      </div>
      {/* <div id="friends" className="sidebar-section">
        <p>
          <h3>Friends</h3>
        </p>
        <ul>
          <li className="friend-li">
            <div>
              <p>Coolguy76</p>
            </div>
          </li>
        </ul>
      </div>
      <div id="friend-requests" className="sidebar-section">
        <p>
          <h3>Friend Requests</h3>
        </p>
        <ul>
          <li className="friend-request-li">
            <div>
              <p>User50</p>
              <button className="btn-block">
                <MdCancel />
              </button>
              <button className="btn-block">
                <IoCheckmarkCircle />
              </button>
            </div>
          </li>
        </ul>
      </div> */}
    </>
  );
};

export default Sidebar;
