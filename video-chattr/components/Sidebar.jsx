import { useState, useEffect } from "react";

import { MdCancel } from "react-icons/md";
import { IoCheckmarkCircle } from "react-icons/io5";
import SidebarList from "./SidebarList";
import { getSavedRooms, unsaveRoom } from "../features/users/usersSlice";
import { useDispatch, useSelector } from "react-redux";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { savedRooms } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.auth);
  const [sidebarData, setSidebarData] = useState({
    rooms: {
      options: {
        btn1: "Join",
        btn2: "Untrack",
      },
    },
  });
  const [fetchData, setFetchData] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }
    console.log("fetching saved rooms");
    setFetchData(false);
    dispatch(getSavedRooms({ user }));
  }, [user, fetchData]);

  // const [rooms, setRooms] = useState([
  //   {
  //     roomName: "Test Room 1",
  //   },
  //   {
  //     roomName: "Study room",
  //   },
  // ]);

  const onButtonClick = (e, roomID) => {
    if (e.target.id.toLowerCase() === "badbtn".toLowerCase()) {
      // DELETE ROOM FROM SAVED ROOMS
      dispatch(unsaveRoom({ user, roomID: roomID }))
        .unwrap()
        .then(() => setFetchData(true));
    }
  };

  return (
    <>
      <div id="saved-rooms-wrapper" className="sidebar-section">
        <p>
          <h3>Saved Rooms</h3>
        </p>
        <SidebarList
          data={sidebarData["rooms"]}
          arr={savedRooms}
          onClick={onButtonClick}
          type="savedRooms"
        />
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
