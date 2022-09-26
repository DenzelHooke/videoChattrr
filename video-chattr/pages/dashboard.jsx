import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-nextjs-toast";
import { useRouter } from "next/router";
import { wrapper } from "../app/store";
import styles from "../styles/Dashboard.module.scss";
// import RtcUser from "./video/videoFuncs";
import { genRTC, reset, removeToken } from "../features/auth/authSlice";
import { createRoom, setRoom } from "../features/room/roomSlice";
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
  const { rtcToken } = useSelector((state) => state.auth);
  const { rooms, roomName, roomID, isSuccess, exists, isError, message } =
    useSelector((state) => state.room);

  useEffect(() => {
    if (rtcToken) {
    }

    // return () => dispatch(removeToken());
  }, [rtcToken]);

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
  }, []);

  // useEffect(() => {
  //   if(isError) {
  //     if(buttonMode) {

  //     }
  //   }
  // }, [isError, message]);

  const onClick = async ({ roomID, buttonMode }) => {
    if (buttonMode === "create") {
      console.log("%c Creating room...", "color: #4ce353");

      try {
        dispatch(createRoom({ roomID, user }));
        dispatch(genRTC({ roomID })).then(() => {
          //TODO Transfer client to page.
          router.push({
            pathname: "/room",
          });
        });
      } catch (error) {
        //TODO catch common errors
        console.error(error);
      }
    } else if (buttonMode === "join") {
      console.log(`%c Requesting to join room ${roomID}..`, "color: #4ce353");

      //Check whether roopm exists on db.
      //Proceed if true, return if false.

      try {
        const data = await roomService.getRoomData(roomID);
        console.log(data);

        // If doesnt exist
        if (data.exists === false) {
          const err = new Error("No room was found with that ID.");
          err.exists = false;
          throw err;
        }

        //TODO transfer client to room page
        // dispatch(genRTC({ roomID }))
        //   .then  (() => dispatch(setRoom(roomID)))
        //   .then(() => {
        //     router.push({
        //       pathname: "/room",
        //     });
        //   });
      } catch (error) {
        console.error(error);
        if (!error.exists) {
          toast.notify(
            `Unfortunatley,  room ${roomID.slice(0, 5)} doesn't exist.`,
            {
              title: "Darn it!",
              type: "error",
            }
          );
          return;
        }
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
