import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-nextjs-toast";
import { useRouter } from "next/router";
import { wrapper } from "../app/store";
import styles from "../styles/Dashboard.module.scss";
import { unwrapResult } from "@reduxjs/toolkit";
import { removeRoomCookie } from "../helpers/RoomsFuncs";
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
  setMode,
  resetRoomState,
} from "../features/room/roomSlice";
import { createRoomCookie, joinUserToRoom } from "../helpers/RoomsFuncs";

import { setError } from "../features/utils/utilsSlice";
import roomService from "../features/room/roomService";
import LoadingCircle from "../components/LoadingCircle";
import FriendAdder from "../components/FriendAdder";

// The Rooms componenet requires the window object which isn't present  with SSR.
//This loads the component once ssr is done which means this comp isn't loaded in the page source.
const Rooms = dynamic(async () => await import("../components/Rooms"), {
  loading: () => <LoadingCircle />,
  ssr: false,
});

const Sidebar = dynamic(async () => await import("../components/Sidebar"), {
  loading: () => <LoadingCircle />,
  ssr: false,
});

export default function Dashboard({ user }) {
  const dispatch = useDispatch();
  const isServer = typeof window === "undefined";
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const { rtcToken, push } = useSelector((state) => state.auth);
  const { rooms, roomName, roomID, isSuccess, mode, exists, isError, message } =
    useSelector((state) => state.room);

  useEffect(() => {
    console.log(push, roomName);
    // Once setPush as been set to "room" and a roomName has been set,
    // Create cookie and push client to room page.
    if (push === "room" && roomName) {
      createRoomCookie(mode, rtcToken);
      router.push({
        pathname: "/room",
      });
    }
  }, [push, roomName]);

  useEffect(() => {
    console.log("USER: ", user);
    if (!isServer) {
      if (!user) {
        toast.notify("Must be logged in to view this page.", {
          title: "Error",
          type: "error",
        });
        dispatch(
          setError({
            message: "Must be logged in to view this page.",
            push: "/",
          })
        );
        return;
      }
    }

    return () => {
      dispatch(resetPush());
    };
  }, []);

  const onClick = async ({ userInput, buttonMode }) => {
    dispatch(setMode(buttonMode));
    console.log(buttonMode);
    if (buttonMode === "create") {
      console.log("%c Creating room...", "color: #4ce353");

      dispatch(createRoom({ userInput, user }))
        .unwrap(unwrapResult)
        .then((state) => {
          dispatch(genRTC({ roomID: state.roomID }));
        })
        .catch((error) => {
          console.log("ERR");
          // Remove RTC token, doesn't remove JWT token.
          dispatch(removeToken());
          // Reset the room state so user doesn't get pushed to other rooms.
          dispatch(resetRoomState());
          dispatch(setError({ message: `${error}`, push: "/dashboard" }));
        });
    } else if (buttonMode === "join") {
      // Connect user to room
      await joinUserToRoom({
        roomService,
        userInput,
        toast,
        dispatch,
        user,
      }).catch((error) => {
        // Remove RTC token, doesn't remove JWT token.
        dispatch(removeToken());
        // Reset the room state so user doesn't get pushed to other rooms.
        dispatch(resetRoomState());
        dispatch(setError({ message: `${error}` }));
      });
    }
  };

  return (
    <>
      <div className="growContainer grow">
        <div className={`${styles.mainWrapper}`}>
          <div id="sidebar">
            <Sidebar
              dispatch={dispatch}
              roomService={roomService}
              toast={toast}
            />
          </div>
          <div id={styles.mainContent} className="dashboard-outter-container">
            <div className="dashboard-inner-container">
              <div className="greeting">
                <h2 className="center-text focus-text">{`Welcome home, ${user.username}`}</h2>
              </div>
              <FriendAdder />
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
