import { useState, useEffect } from "react";

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

  const updateData = async () => {
    // Get saved rooms
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
  };

  useEffect(() => {
    setInterval(() => {
      updateData();
    }, 5000);
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    updateData();
    console.log(friendRequests);
    console.log("fetching saved rooms");
    // Set/get saved rooms

    // setFetchData(false);
  }, [user, fetchData]);

  const onButtonClick = async ({ e, value, type }) => {
    // If delete, decline or untrack is pressed:
    if (e.target.id.toLowerCase() === "badbtn") {
      //Check if button was related for rooms
      //* Rooms
      if (type.toLowerCase() === "savedrooms") {
        // DELETE ROOM FROM SAVED ROOMS
        console.log("VALUE: ", user);
        dispatch(unsaveRoom({ user, roomData: value }))
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
      console.log("VAL: ", value);
      //* Rooms
      if (type.toLowerCase() === "savedrooms") {
        // Join user to other room
        try {
          // Joins user to other room
          await joinUserToRoom({
            roomService: roomService,
            userInput: value.roomID,
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

      //* Friends
      //Join friend
      if (type.toLowerCase() === "friends") {
        if (!value.currentRoom) {
          return;
        }

        try {
          // Joins user to other room
          await joinUserToRoom({
            roomService: roomService,
            userInput: value.currentRoom,
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
      }
    }
  };

  return (
    <>
      <div id="saved-rooms-wrapper" className="sidebar-section">
        <h3>Saved Rooms</h3>
        <SidebarList
          data={sidebarData["rooms"]}
          arr={savedRooms}
          onClick={onButtonClick}
          type="savedRooms"
        />
      </div>
      <div id="friend-requests" className="sidebar-section">
        <h3>Friend Requests</h3>
        <SidebarList
          data={sidebarData["friendRequests"]}
          arr={friendRequests}
          onClick={onButtonClick}
          type="friendRequests"
        />
      </div>
      <div id="friends" className="sidebar-section">
        <h3>Friends</h3>
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
