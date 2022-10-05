import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-nextjs-toast";
import { useRouter } from "next/router";
import { wrapper } from "../app/store";
import styles from "../styles/Dashboard.module.scss";
// import RtcUser from "./video/videoFuncs";
import {
  genRTC,
  reset,
  removeToken,
  resetPush,
  setPush,
} from "../features/auth/authSlice";
import {
  createRoom,
  setRoomName,
  setRoomID,
  setMode,
} from "../features/room/roomSlice";
import { createRoomCookie } from "../helpers/RoomsFuncs";
import io from "socket.io-client";
import roomService from "../features/room/roomService";
import LoadingRoomForm from "../components/LoadingRoomForm";
import LoadingCircle from "../components/LoadingCircle";
import uuid4 from "uuid4";
import cookies from "js-cookie";
import axios from "axios";

// The Rooms componenet requires the window object which isn't present  with SSR.
//This loads the component once ssr is done which means this comp isn't loaded in the page source.
const Rooms = dynamic(async () => await import("../components/Rooms"), {
  loading: () => <LoadingCircle />,
  ssr: false,
});

const DisplayRooms = dynamic(
  async () => await import("../components/DisplayRooms"),
  {
    loading: () => <LoadingCircle />,
    ssr: false,
  }
);

function dashboard({ user }) {
  const dispatch = useDispatch();
  const isServer = typeof window === "undefined";
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const { rtcToken, push } = useSelector((state) => state.auth);
  const { rooms, roomName, roomID, isSuccess, mode, exists, isError, message } =
    useSelector((state) => state.room);

  useEffect(() => {
    // return;
    if (push === "room" && roomName) {
      createRoomCookie(mode, rtcToken);
      router.push({
        pathname: "/room",
      });
    }
  }, [push, roomName]);

  useEffect(() => {
    console.log("USSR: ", user);
    if (!isServer) {
      console.log(authState.user.token);
      if (!user) {
        toast.notify("Must be logged in to view this page.", {
          title: "Error",
          type: "error",
        });
        router.push("/");
        return;
      }

      toast.notify(`Hello, ${user.username}`);
    }

    return () => {
      dispatch(resetPush("room"));
    };
  }, []);

  useEffect(() => {
    if (isServer) {
      if (message && isError) {
        console.error(message);
        dispatch(removeToken());
        dispatch(reset());
        dispatch(resetPush());
      }
    }
  }, [message, isError]);

  const onClick = async ({ userInput, buttonMode }) => {
    dispatch(setMode(buttonMode));
    if (buttonMode === "create") {
      console.log("%c Creating room...", "color: #4ce353");

      try {
        dispatch(createRoom({ userInput, user }))
          .unwrap()
          .then((state) => dispatch(genRTC({ roomID: state.roomID })));
      } catch (error) {
        //TODO catch common errors
        console.error(error);
      }
    } else if (buttonMode === "join") {
      console.log(
        `%c Requesting to join room ${userInput}..`,
        "color: #4ce353"
      );

      //Check whether roopm exists on db.
      //Proceed if true, return if false.

      try {
        const data = await roomService.getRoomData(userInput);
        console.log(data);

        if (!data.exists) {
          const err = new Error("That room couldn't be found.");
          throw err;
        }

        toast.notify(`Connecting to room ${userInput.slice(0, 5)}..`, {
          title: "WooHoo!",
          type: "success",
        });

        try {
          dispatch(genRTC({ roomID: data.room.roomID }))
            .unwrap()
            .then(() => {
              dispatch(setRoomName(data.room.roomName));
              dispatch(setRoomID(data.room.roomID));
              dispatch(setPush("room"));
            });
        } catch (error) {
          console.error(error);
          throw new Error();
        }
      } catch (error) {
        toast.notify(`${error}`, {
          title: "Darn it!",
          type: "error",
        });
        return;
      }
    }
  };

  return (
    <>
      <div className="growContainer grow">
        <div className={`${styles.mainWrapper}`}>
          <div id={styles.sidebar}>
            <DisplayRooms rooms={rooms} />
          </div>
          <div id={styles.mainContent} className="dashboard">
            <div className="dashboard-container">
              <div className="greeting">
                <h2 className="center-text focus-text">{`Welcome home, ${user.username}`}</h2>
              </div>
              {<Rooms onClick={onClick} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ res, req }) => {
      // console.log(auth);
      // console.log(req.cookies);
      let { user } = req.cookies;
      try {
        user = JSON.parse(user);
        console.log(user);
      } catch (error) {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }

      return {
        props: { user },
      };
    }
);

// if (!user) {
//   return {
//     redirect: {
//       destination: "/",
//       permanent: false,
//     },
//   };
// }

// return {
//   props: { user },
// };

export default dashboard;
