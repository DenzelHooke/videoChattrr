import { useState, useEffect } from "react";

import { MdCancel } from "react-icons/md";
import { IoCheckmarkCircle } from "react-icons/io5";
import SidebarList from "./SidebarList";
import {
  getSavedRooms,
  unsaveRoom,
  getIncomingFriendRequests,
  deleteFriendRequest,
  createFriend,
  getFriends,
  deleteFriend,
} from "../features/users/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import { joinUserToRoom } from "../helpers/RoomsFuncs";
import roomService from "../features/room/roomService";
import { toast } from "react-nextjs-toast";
import { setError } from "../features/utils/utilsSlice";

const Sidebar = () => {
  const dispatch = useDispatch();

  const [fetchData, setFetchData] = useState(false);
  const { savedRooms, friendRequests, friends } = useSelector(
    (state) => state.users
  );
  const { user } = useSelector((state) => state.auth);
  const [sidebarData, setSidebarData] = useState({
    rooms: {
      options: {
        btn1: "Join",
        btn2: "Untrack",
      },
    },
    friendRequests: {
      options: {
        btn1: "Accept",
        btn2: "Decline",
      },
    },
    friends: {
      options: {
        btn1: "Not in room",
        btn2: "Delete",
      },
    },
  });

  useEffect(() => {
    if (!user) {
      return;
    }
    console.log(friendRequests);
    console.log("fetching saved rooms");
    // Set/get saved rooms
    dispatch(getSavedRooms({ user }))
      .unwrap()
      .catch((error) => {
        dispatch(setError({ message: `${error}` }));
      });

    //Set/get incoming friend requests
    dispatch(getIncomingFriendRequests({ user }))
      .unwrap()
      .catch((error) => {
        dispatch(setError({ message: `${error}` }));
      });

    //Get friends
    dispatch(getFriends({ user }))
      .unwrap()
      .catch((error) => {
        dispatch(setError({ message: `${error}` }));
      });

    setFetchData(false);
  }, [user, fetchData]);

  const onButtonClick = async ({ e, value, type }) => {
    // If delete, decline or untrack is pressed:
    if (e.target.id.toLowerCase() === "badbtn") {
      //Check if button was related for rooms
      //* Rooms
      if (type.toLowerCase() === "savedrooms") {
        // DELETE ROOM FROM SAVED ROOMS
        dispatch(unsaveRoom({ user, roomID: value }))
          .unwrap()
          .then(() => setFetchData(true))
          .catch((error) => {
            dispatch(setError({ message: `${error}` }));
          });
      }

      //* Friend requests
      if (type.toLowerCase() === "friendrequests") {
        dispatch(deleteFriendRequest({ user, to: value._id }))
          .unwrap()
          .catch((error) => {
            dispatch(setError({ message: `${error}` }));
          });
      }

      if (type.toLowerCase() === "friends") {
        //Get friends
        dispatch(deleteFriend({ user, friendID: value._id }))
          .unwrap()
          .catch((error) => {
            dispatch(setError({ message: `${error}` }));
          });
      }
    }

    // Triggers if Join, save, accept are clicked on the sidebar
    if (e.target.id.toLowerCase() === "goodbtn") {
      console.log("good btn clocked");
      //* Rooms
      if (type.toLowerCase() === "savedrooms") {
        // Join user to other room
        try {
          // Joins user to other room
          await joinUserToRoom({
            roomService: roomService,
            userInput: value,
            toast: toast,
            dispatch: dispatch,
            user: user,
          });
        } catch (error) {
          console.error(error);
          if (`${error}` === "AxiosError: Network Error") {
            dispatch(setError({ message: "Failed to connect to server." }));
          }
          dispatch(setError({ message: `${error}` }));
          return;
        }
      } else if (type.toLowerCase() === "friendrequests") {
        console.log("SENDING F Req");
      }

      //* Friend requests
      if (type.toLowerCase() === "friendrequests") {
        dispatch(createFriend({ user, to: value._id }))
          .unwrap()
          .catch((error) => {
            dispatch(setError({ message: `${error}` }));
          });
      }
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
      <div id="friend-requests" className="sidebar-section">
        <p>
          <h3>Friend Requests</h3>
        </p>
        <SidebarList
          data={sidebarData["friendRequests"]}
          arr={friendRequests}
          onClick={onButtonClick}
          type="friendRequests"
        />
      </div>
      <div id="friends" className="sidebar-section">
        <p>
          <h3>Friends</h3>
        </p>
        <SidebarList
          data={sidebarData["friends"]}
          arr={friends}
          onClick={onButtonClick}
          type="friends"
        />
      </div>
    </>
  );
};

export default Sidebar;
