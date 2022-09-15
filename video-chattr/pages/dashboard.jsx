import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-nextjs-toast";
import { useRouter } from "next/router";
import { wrapper } from "../app/store";
import styles from "../styles/Dashboard.module.scss";
import DisplayRooms from "../components/DisplayRooms";
// import RtcUser from "./video/videoFuncs";
import { genRTC } from "../features/auth/authSlice";
import { setRoom } from "../features/room/roomSlice";
import io from "socket.io-client";
import { roomExists } from "../helpers/RoomsFuncs";
import LoadingRoomForm from "../components/LoadingRoomForm";
import LoadingCircle from "../components/LoadingCircle";
// The Rooms componenet requires the window object which isn't present  with SSR.
//This loads the component once ssr is done which means this comp isn't loaded in the page source.
const Rooms = dynamic(async () => await import("../components/Rooms"), {
  loading: () => <LoadingCircle />,
  ssr: false,
});

function dashboard({ user }) {
  const dispatch = useDispatch();
  const isServer = typeof window === "undefined";
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const { rooms } = useSelector((state) => state.room);
  const socketRef = useRef();

  useEffect(() => {
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
      // socketRef.current = io.connect("localhost:8080", {
      //   auth: {
      //     token: user.token,
      //   },
      // });

      // socketRef.current.emit("init", {
      //   user: user,
      //   room: "dashboard",
      // });
    }
  }, []);

  // useEffect(() => {
  //   if (rtcToken) {
  //     router.push({
  //       pathname: "/room",
  //       query: { roomID: roomName, token: rtcToken },
  //     });
  //   }
  // }, [rtcToken, roomName]);

  const onClick = async ({ type, room }) => {
    const data = { roomID: room };
    // Create rtcToken
    dispatch(genRTC(data)).then(() => dispatch(setRoom(room)));
    // const exists = await roomExists(room, authState.user.token);

    // console.log("HITHITIHTR", exists);
    // if (exists === true) {
    //   console.log("GOOD");
    //   toast.notify(`${room} Available!`, {
    //     title: "Woohoo!",
    //     type: "success",
    //   });
    // } else {
    //   console.log("BAD");
    //   toast.notify(`Unfortunatly, "${room}" is  Unavailable.`, {
    //     title: "Oops",
    //     type: "error",
    //   });
    // }

    const btnType = type.toLowerCase();
    if (btnType !== "create" && btnType !== "join") {
      return;
    }

    if (btnType === "create") {
      //Loading useDispatch
      //Send socket data
    }
    //Connect to room or create room.
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
      const { auth } = store.getState();
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
